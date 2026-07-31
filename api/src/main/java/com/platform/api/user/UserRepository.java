package com.platform.api.user;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

  boolean existsByPersonalId(String personalId);

  boolean existsByEmailIgnoreCase(String email);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  Optional<User> findByGoogleSub(String googleSub);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  @Query("""
      SELECT u FROM User u
      WHERE LOWER(u.email) = LOWER(:email)
      """)
  Optional<User> findByEmailIgnoreCase(@Param("email") String email);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  @Query("""
      SELECT u FROM User u
      WHERE LOWER(u.personalId) = LOWER(:login)
         OR LOWER(u.email) = LOWER(:login)
      """)
  Optional<User> findByPersonalIdOrEmailIgnoreCase(@Param("login") String login);

  @EntityGraph(attributePaths = {"roles", "roles.permissions"})
  @Query("SELECT u FROM User u WHERE u.id = :id")
  Optional<User> findByIdWithRolesAndPermissions(@Param("id") UUID id);
}
