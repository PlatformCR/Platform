package com.platform.api.media;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class LocalObjectStorage implements ObjectStorage {

  private final Path root;

  public LocalObjectStorage(@Value("${app.storage.local-path:../data/uploads}") String localPath) {
    Path configured = Paths.get(localPath);
    this.root = configured.isAbsolute()
        ? configured.normalize()
        : Paths.get(System.getProperty("user.dir")).resolve(configured).normalize();
    try {
      Files.createDirectories(this.root);
    } catch (IOException e) {
      throw new IllegalStateException("Unable to create storage directory: " + this.root, e);
    }
  }

  @Override
  public void store(InputStream content, String key, String contentType, long sizeBytes) {
    Path target = resolveSafe(key);
    try {
      Files.createDirectories(target.getParent());
      Files.copy(content, target, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
      throw new IllegalStateException("Failed to store object: " + key, e);
    }
  }

  @Override
  public void delete(String key) {
    try {
      Files.deleteIfExists(resolveSafe(key));
    } catch (IOException e) {
      throw new IllegalStateException("Failed to delete object: " + key, e);
    }
  }

  @Override
  public String resolveUrl(String key) {
    return "/api/media/files/" + key.replace('\\', '/');
  }

  public Path resolvePath(String key) {
    return resolveSafe(key);
  }

  public void copyTo(String key, OutputStream output) throws IOException {
    Files.copy(resolveSafe(key), output);
  }

  public boolean exists(String key) {
    return Files.isRegularFile(resolveSafe(key));
  }

  private Path resolveSafe(String key) {
    if (key == null || key.isBlank()) {
      throw new IllegalArgumentException("Object key is required");
    }
    String normalized = key.replace('\\', '/');
    if (normalized.startsWith("/") || normalized.contains("..")) {
      throw new IllegalArgumentException("Invalid object key");
    }
    Path resolved = root.resolve(normalized).normalize();
    if (!resolved.startsWith(root)) {
      throw new IllegalArgumentException("Invalid object key");
    }
    return resolved;
  }
}
