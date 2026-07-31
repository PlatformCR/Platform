package com.platform.api.security;

import com.platform.api.auth.SessionRepository;
import com.platform.api.user.User;
import com.platform.api.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Component
public class JwtOrSessionAuthenticationFilter extends OncePerRequestFilter {

  private final SessionRepository sessionRepository;
  private final UserRepository userRepository;

  public JwtOrSessionAuthenticationFilter(
      SessionRepository sessionRepository,
      UserRepository userRepository
  ) {
    this.sessionRepository = sessionRepository;
    this.userRepository = userRepository;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      String rawToken = header.substring(7).trim();
      if (!rawToken.isEmpty()) {
        authenticate(rawToken);
      }
    }
    filterChain.doFilter(request, response);
  }

  private void authenticate(String rawToken) {
    String tokenHash = TokenService.sha256Hex(rawToken);
    sessionRepository.findActiveByTokenHash(tokenHash, Instant.now()).ifPresent(session -> {
      User user = userRepository.findByIdWithRolesAndPermissions(session.getUser().getId())
          .orElse(null);
      if (user != null && user.isEnabled()) {
        SecurityContextHolder.getContext().setAuthentication(
            SessionAuthenticationToken.from(session, user)
        );
      }
    });
  }
}
