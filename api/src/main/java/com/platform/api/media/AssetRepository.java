package com.platform.api.media;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AssetRepository extends JpaRepository<Asset, UUID> {

  Optional<Asset> findByObjectKey(String objectKey);
}
