package com.platform.api.media;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/media")
public class MediaController {

  private final MediaService mediaService;
  private final LocalObjectStorage localObjectStorage;
  private final AssetRepository assetRepository;

  public MediaController(
      MediaService mediaService,
      LocalObjectStorage localObjectStorage,
      AssetRepository assetRepository
  ) {
    this.mediaService = mediaService;
    this.localObjectStorage = localObjectStorage;
    this.assetRepository = assetRepository;
  }

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public AssetResponse upload(@RequestParam("file") MultipartFile file) {
    return mediaService.upload(file);
  }

  @GetMapping("/files/{*path}")
  public void download(@PathVariable("path") String path, HttpServletResponse response) throws IOException {
    String objectKey = path.startsWith("/") ? path.substring(1) : path;
    if (objectKey.isBlank() || !localObjectStorage.exists(objectKey)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
    }

    Path filePath = localObjectStorage.resolvePath(objectKey);
    String contentType = assetRepository.findByObjectKey(objectKey)
        .map(Asset::getContentType)
        .orElseGet(() -> {
          try {
            String probed = Files.probeContentType(filePath);
            return probed != null ? probed : MediaType.APPLICATION_OCTET_STREAM_VALUE;
          } catch (IOException e) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
          }
        });

    response.setStatus(HttpStatus.OK.value());
    response.setHeader(HttpHeaders.CONTENT_TYPE, contentType);
    response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(Files.size(filePath)));
    localObjectStorage.copyTo(objectKey, response.getOutputStream());
  }
}
