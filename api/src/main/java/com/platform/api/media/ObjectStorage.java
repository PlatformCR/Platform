package com.platform.api.media;

import java.io.InputStream;

public interface ObjectStorage {

  void store(InputStream content, String key, String contentType, long sizeBytes);

  void delete(String key);

  String resolveUrl(String key);
}
