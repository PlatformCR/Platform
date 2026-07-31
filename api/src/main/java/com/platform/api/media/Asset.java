package com.platform.api.media;

import com.platform.api.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "assets")
public class Asset {

  @Id
  private UUID id;

  @Column(name = "object_key", nullable = false, unique = true, length = 512)
  private String objectKey;

  @Column(nullable = false, length = 1024)
  private String url;

  @Column(name = "content_type", nullable = false, length = 128)
  private String contentType;

  @Column(name = "size_bytes", nullable = false)
  private long sizeBytes;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "uploaded_by")
  private User uploadedBy;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  protected Asset() {
  }

  public Asset(
      UUID id,
      String objectKey,
      String url,
      String contentType,
      long sizeBytes,
      User uploadedBy,
      Instant createdAt
  ) {
    this.id = id;
    this.objectKey = objectKey;
    this.url = url;
    this.contentType = contentType;
    this.sizeBytes = sizeBytes;
    this.uploadedBy = uploadedBy;
    this.createdAt = createdAt;
  }

  public UUID getId() {
    return id;
  }

  public String getObjectKey() {
    return objectKey;
  }

  public String getUrl() {
    return url;
  }

  public String getContentType() {
    return contentType;
  }

  public long getSizeBytes() {
    return sizeBytes;
  }

  public User getUploadedBy() {
    return uploadedBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
