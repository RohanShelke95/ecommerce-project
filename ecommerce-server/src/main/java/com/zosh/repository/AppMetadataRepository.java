package com.zosh.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.modal.AppMetadata;

public interface AppMetadataRepository extends JpaRepository<AppMetadata, Long> {

    Optional<AppMetadata> findByMetaKey(String metaKey);
}
