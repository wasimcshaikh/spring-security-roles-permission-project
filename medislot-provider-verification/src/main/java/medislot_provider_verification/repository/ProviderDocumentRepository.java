package medislot_provider_verification.repository;

import medislot_provider_verification.entity.ProviderDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderDocumentRepository
        extends JpaRepository<ProviderDocument, Long> {

    List<ProviderDocument> findByProviderId(Long providerId);

    Optional<ProviderDocument> findByIdAndProviderId(
            Long documentId,
            Long providerId
    );
}