package medislot_provider_verification.repository;

import medislot_provider_verification.entity.Provider;
import medislot_provider_verification.entity.Role;
import medislot_provider_verification.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface ProviderRepository
        extends JpaRepository<Provider, Long> {

    Optional<Provider> findByEmail(String email);

    List<Provider> findByRoleNameNotOrderByIdAsc(String roleName);
}