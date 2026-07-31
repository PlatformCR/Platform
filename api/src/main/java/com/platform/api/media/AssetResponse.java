package com.platform.api.media;

import java.util.UUID;

public record AssetResponse(
    UUID id,
    String objectKey,
    String url,
    String contentType,
    long sizeBytes
) {
}
