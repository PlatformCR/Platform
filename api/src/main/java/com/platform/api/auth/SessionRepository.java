package com.platform.api.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {

  @Query("""
      SELECT s FROM Session s
      JOIN FETCH s.user u
      WHERE s.tokenHash = :tokenHash
        AND s.revokedAt IS NULL
        AND s.expiresAt > :now
      """)
  Optional<Session> findActiveByTokenHash(@Param("tokenHash") String tokenHash, @Param("now") Instant now);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("""
      UPDATE Session s
      SET s.revokedAt = :now
      WHERE s.user.id = :userId
        AND s.revokedAt IS NULL
      """)
  int revokeAllActiveForUser(@Param("userId") UUID userId, @Param("now") Instant now);
}
