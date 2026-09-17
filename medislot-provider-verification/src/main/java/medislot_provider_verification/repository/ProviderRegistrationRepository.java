package medislot_provider_verification.repository;

import medislot_provider_verification.entity.ProviderRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProviderRegistrationRepository
        extends JpaRepository<ProviderRegistration, Long> {

    Optional<ProviderRegistration> findByEmail(String email);
}