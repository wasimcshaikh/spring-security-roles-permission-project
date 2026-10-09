package medislot_provider_verification.repository;

import medislot_provider_verification.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;
import java.util.List;

public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<Customer> findByActiveTrueOrderByIdAsc();
    Optional<Customer> findByIdAndActiveTrue(Long id);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Long id);
}