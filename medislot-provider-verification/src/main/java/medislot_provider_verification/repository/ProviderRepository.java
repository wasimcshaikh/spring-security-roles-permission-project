package medislot_provider_verification.repository;

import medislot_provider_verification.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository
        extends JpaRepository<Provider, Long> {

    Optional<Provider> findByEmail(String email);

    List<Provider> findByEmailIn(List<String> emails);

    List<Provider> findByRoleNameNotOrderByIdAsc(String roleName);

    @Query("""
        SELECT r.name, COUNT(p)
        FROM Provider p
        JOIN p.role r
        GROUP BY r.name
    """)
    List<Object[]> countProvidersByRole();
}