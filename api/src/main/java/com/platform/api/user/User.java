package com.platform.api.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

  @Id
  private UUID id;

  @Column(name = "personal_id", nullable = false, unique = true, length = 64)
  private String personalId;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "password_hash")
  private String passwordHash;

  @Column(name = "google_sub", unique = true, length = 128)
  private String googleSub;

  @Column(name = "display_name", length = 255)
  private String displayName;

  @Column(name = "avatar_url", length = 1024)
  private String avatarUrl;

  @Column(nullable = false)
  private boolean enabled = true;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id")
  )
  private Set<Role> roles = new HashSet<>();

  protected User() {
  }

  public User(UUID id, String personalId, String email, String passwordHash, boolean enabled, Instant createdAt) {
    this.id = id;
    this.personalId = personalId;
    this.email = email;
    this.passwordHash = passwordHash;
    this.enabled = enabled;
    this.createdAt = createdAt;
  }

  public UUID getId() {
    return id;
  }

  public String getPersonalId() {
    return personalId;
  }

  public void setPersonalId(String personalId) {
    this.personalId = personalId;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getGoogleSub() {
    return googleSub;
  }

  public void setGoogleSub(String googleSub) {
    this.googleSub = googleSub;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles == null ? new HashSet<>() : new HashSet<>(roles);
  }
}
