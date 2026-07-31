package com.platform.api.security;

import com.platform.api.auth.Session;
import com.platform.api.user.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public class SessionAuthenticationToken extends AbstractAuthenticationToken {

  private final UUID userId;
  private final UUID sessionId;
  private final String personalId;

  public SessionAuthenticationToken(
      UUID userId,
      UUID sessionId,
      String personalId,
      Collection<? extends GrantedAuthority> authorities
  ) {
    super(authorities);
    this.userId = userId;
    this.sessionId = sessionId;
    this.personalId = personalId;
    setAuthenticated(true);
  }

  public static SessionAuthenticationToken from(Session session, User user) {
    return new SessionAuthenticationToken(
        user.getId(),
        session.getId(),
        user.getPersonalId(),
        AuthorityMapper.toAuthorities(user)
    );
  }

  @Override
  public Object getCredentials() {
    return "";
  }

  @Override
  public Object getPrincipal() {
    return personalId;
  }

  public UUID getUserId() {
    return userId;
  }

  public UUID getSessionId() {
    return sessionId;
  }

  public String getPersonalId() {
    return personalId;
  }
}
