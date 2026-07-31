package com.platform.api.media;

import com.platform.api.security.SessionAuthenticationToken;
import com.platform.api.user.User;
import com.platform.api.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.UUID;

@Service
public class MediaService {

  private final ObjectStorage objectStorage;
  private final AssetRepository assetRepository;
  private final UserRepository userRepository;

  public MediaService(
      ObjectStorage objectStorage,
      AssetRepository assetRepository,
      UserRepository userRepository
  ) {
    this.objectStorage = objectStorage;
    this.assetRepository = assetRepository;
    this.userRepository = userRepository;
  }

  @Transactional
  public AssetResponse upload(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
    }

    String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload";
    String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
    String objectKey = Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + "-" + safeName;
    String contentType = file.getContentType() != null ? file.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

    try (InputStream inputStream = file.getInputStream()) {
      objectStorage.store(inputStream, objectKey, contentType, file.getSize());
    } catch (IOException e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read upload");
    }

    User uploader = currentUser().orElse(null);
    String url = objectStorage.resolveUrl(objectKey);
    Asset asset = new Asset(
        UUID.randomUUID(),
        objectKey,
        url,
        contentType,
        file.getSize(),
        uploader,
        Instant.now()
    );
    assetRepository.save(asset);

    return new AssetResponse(asset.getId(), asset.getObjectKey(), asset.getUrl(), asset.getContentType(), asset.getSizeBytes());
  }

  private java.util.Optional<User> currentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (!(authentication instanceof SessionAuthenticationToken token)) {
      return java.util.Optional.empty();
    }
    return userRepository.findById(token.getUserId());
  }
}
