package com.platform.api.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.platform.api.security.AuthorityMapper;
import com.platform.api.security.SessionAuthenticationToken;
import com.platform.api.security.TokenService;
import com.platform.api.user.Role;
import com.platform.api.user.RoleRepository;
import com.platform.api.user.User;
import com.platform.api.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final SessionRepository sessionRepository;
  private final PasswordEncoder passwordEncoder;
  private final GoogleTokenVerifier googleTokenVerifier;
  private final long sessionTtlHours;

  public AuthService(
      UserRepository userRepository,
      RoleRepository roleRepository,
      SessionRepository sessionRepository,
      PasswordEncoder passwordEncoder,
      GoogleTokenVerifier googleTokenVerifier,
      @Value("${app.session.ttl-hours:24}") long sessionTtlHours
  ) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.sessionRepository = sessionRepository;
    this.passwordEncoder = passwordEncoder;
    this.googleTokenVerifier = googleTokenVerifier;
    this.sessionTtlHours = sessionTtlHours;
  }

  @Transactional
  public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByPersonalIdOrEmailIgnoreCase(request.personalId().trim())
        .orElseThrow(() -> unauthorized("Invalid credentials"));

    if (!user.isEnabled()) {
      throw unauthorized("Invalid credentials");
    }
    if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
      throw unauthorized("This account uses Google Sign-In. Continue with Google or set a password later.");
    }
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw unauthorized("Invalid credentials");
    }

    return issueSession(user);
  }

  @Transactional
  public LoginResponse register(RegisterRequest request) {
    String personalId = request.personalId().trim();
    String email = request.email().trim().toLowerCase(Locale.ROOT);
    String password = request.password();
    String confirm = request.confirmPassword();

    if (!password.equals(confirm)) {
      throw badRequest("Passwords do not match");
    }
    if (password.length() < 8) {
      throw badRequest("Password must be at least 8 characters");
    }
    if (userRepository.existsByPersonalId(personalId) || userRepository.existsByEmailIgnoreCase(email)) {
      throw conflict("Already registered");
    }

    Role userRole = roleRepository.findByCode("USER")
        .orElseThrow(() -> new IllegalStateException("USER role missing — run Flyway migrations"));

    User user = new User(
        UUID.randomUUID(),
        personalId,
        email,
        passwordEncoder.encode(password),
        true,
        Instant.now()
    );
    user.setRoles(new HashSet<>());
    user.getRoles().add(userRole);
    userRepository.save(user);

    return issueSession(user);
  }

  @Transactional
  public LoginResponse loginWithGoogle(GoogleLoginRequest request) {
    GoogleIdToken.Payload payload = googleTokenVerifier.verify(request.idToken().trim());
    String googleSub = payload.getSubject();
    String email = payload.getEmail().trim().toLowerCase(Locale.ROOT);
    String displayName = googleDisplayName(payload);
    String avatarUrl = googleAvatarUrl(payload);

    User user = userRepository.findByGoogleSub(googleSub)
        .or(() -> userRepository.findByEmailIgnoreCase(email))
        .orElseGet(() -> createGoogleUser(googleSub, email, displayName, avatarUrl));

    boolean dirty = false;
    if (user.getGoogleSub() == null || user.getGoogleSub().isBlank()) {
      user.setGoogleSub(googleSub);
      dirty = true;
    }
    if (displayName != null && !displayName.equals(user.getDisplayName())) {
      user.setDisplayName(displayName);
      dirty = true;
    }
    if (avatarUrl != null && !avatarUrl.equals(user.getAvatarUrl())) {
      user.setAvatarUrl(avatarUrl);
      dirty = true;
    }
    if (dirty) {
      userRepository.save(user);
    }

    if (!user.isEnabled()) {
      throw unauthorized("Account disabled");
    }

    return issueSession(user);
  }

  @Transactional
  public void logout() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (!(authentication instanceof SessionAuthenticationToken token)) {
      throw unauthorized("Not authenticated");
    }

    Session session = sessionRepository.findById(token.getSessionId())
        .orElseThrow(() -> unauthorized("Session not found"));

    if (session.getRevokedAt() == null) {
      session.setRevokedAt(Instant.now());
    }
  }

  @Transactional(readOnly = true)
  public UserResponse me() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (!(authentication instanceof SessionAuthenticationToken token)) {
      throw unauthorized("Not authenticated");
    }

    User user = userRepository.findByIdWithRolesAndPermissions(token.getUserId())
        .orElseThrow(() -> unauthorized("User not found"));

    return toUserResponse(user);
  }

  public static UserResponse toUserResponse(User user) {
    return new UserResponse(
        user.getPersonalId(),
        user.getEmail(),
        user.getDisplayName(),
        user.getAvatarUrl(),
        AuthorityMapper.roleCodes(user),
        AuthorityMapper.permissionCodes(user)
    );
  }

  private LoginResponse issueSession(User user) {
    Instant now = Instant.now();
    sessionRepository.revokeAllActiveForUser(user.getId(), now);

    String rawToken = TokenService.generateOpaqueToken();
    String tokenHash = TokenService.sha256Hex(rawToken);

    Session session = new Session(
        UUID.randomUUID(),
        user,
        tokenHash,
        now.plus(sessionTtlHours, ChronoUnit.HOURS),
        now
    );
    sessionRepository.save(session);

    User loaded = userRepository.findByIdWithRolesAndPermissions(user.getId()).orElse(user);
    return new LoginResponse(rawToken, toUserResponse(loaded));
  }

  private User createGoogleUser(String googleSub, String email, String displayName, String avatarUrl) {
    Role userRole = roleRepository.findByCode("USER")
        .orElseThrow(() -> new IllegalStateException("USER role missing — run Flyway migrations"));

    String personalId = uniqueGooglePersonalId(googleSub);
    User user = new User(
        UUID.randomUUID(),
        personalId,
        email,
        null,
        true,
        Instant.now()
    );
    user.setGoogleSub(googleSub);
    user.setDisplayName(displayName);
    user.setAvatarUrl(avatarUrl);
    user.setRoles(new HashSet<>());
    user.getRoles().add(userRole);
    return userRepository.save(user);
  }

  private static String googleDisplayName(GoogleIdToken.Payload payload) {
    Object name = payload.get("name");
    if (name instanceof String s && !s.isBlank()) {
      return s.trim();
    }
    Object given = payload.get("given_name");
    if (given instanceof String s && !s.isBlank()) {
      return s.trim();
    }
    return null;
  }

  private static String googleAvatarUrl(GoogleIdToken.Payload payload) {
    Object picture = payload.get("picture");
    if (picture instanceof String s && !s.isBlank()) {
      return s.trim();
    }
    return null;
  }

  private String uniqueGooglePersonalId(String googleSub) {
    String cleaned = googleSub.replaceAll("[^a-zA-Z0-9]", "");
    if (cleaned.length() > 48) {
      cleaned = cleaned.substring(0, 48);
    }
    String base = "g_" + cleaned;
    String candidate = base;
    int i = 0;
    while (userRepository.existsByPersonalId(candidate)) {
      i++;
      candidate = base.substring(0, Math.min(base.length(), 60)) + i;
    }
    return candidate.length() > 64 ? candidate.substring(0, 64) : candidate;
  }

  private static ResponseStatusException unauthorized(String detail) {
    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, detail);
  }

  private static ResponseStatusException badRequest(String detail) {
    return new ResponseStatusException(HttpStatus.BAD_REQUEST, detail);
  }

  private static ResponseStatusException conflict(String detail) {
    return new ResponseStatusException(HttpStatus.CONFLICT, detail);
  }
}
