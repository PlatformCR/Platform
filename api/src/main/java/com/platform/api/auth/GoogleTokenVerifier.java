package com.platform.api.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Component
public class GoogleTokenVerifier {

  private final String clientId;
  private final GoogleIdTokenVerifier verifier;

  public GoogleTokenVerifier(@Value("${app.google.client-id:}") String clientId) {
    this.clientId = clientId == null ? "" : clientId.trim();
    if (this.clientId.isBlank()) {
      this.verifier = null;
    } else {
      this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
          .setAudience(Collections.singletonList(this.clientId))
          .build();
    }
  }

  public boolean isConfigured() {
    return verifier != null;
  }

  public GoogleIdToken.Payload verify(String idTokenString) {
    if (verifier == null) {
      throw new ResponseStatusException(
          HttpStatus.SERVICE_UNAVAILABLE,
          "Google Sign-In is not configured (set app.google.client-id / GOOGLE_CLIENT_ID)"
      );
    }
    try {
      GoogleIdToken idToken = verifier.verify(idTokenString);
      if (idToken == null) {
        throw unauthorized("Invalid Google ID token");
      }
      GoogleIdToken.Payload payload = idToken.getPayload();
      if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
        throw unauthorized("Google email is not verified");
      }
      if (payload.getEmail() == null || payload.getEmail().isBlank()) {
        throw unauthorized("Google token missing email");
      }
      return payload;
    } catch (GeneralSecurityException | IOException ex) {
      throw unauthorized("Unable to verify Google ID token");
    }
  }

  private static ResponseStatusException unauthorized(String detail) {
    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, detail);
  }
}
