package medislot_provider_verification.service;

import medislot_provider_verification.dto.CustomerRequest;
import medislot_provider_verification.dto.CustomerResponse;
import medislot_provider_verification.entity.Customer;
import medislot_provider_verification.exception.CustomerAlreadyExistsException;
import medislot_provider_verification.exception.CustomerNotFoundException;
import medislot_provider_verification.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerServiceImpl
        implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(
            CustomerRepository customerRepository) {

        this.customerRepository =
                customerRepository;
    }

    @Override
    public CustomerResponse createCustomer(
            CustomerRequest request) {

        String email =
                request.getEmail().trim();

        String phoneNumber =
                request.getPhoneNumber().trim();

        // Check duplicate email
        if (customerRepository.existsByEmail(email)) {

            throw new CustomerAlreadyExistsException(
                    "Customer with this email already exists"
            );
        }

        // Check duplicate phone number
        if (customerRepository.existsByPhoneNumber(phoneNumber)) {

            throw new CustomerAlreadyExistsException(
                    "Customer with this phone number already exists"
            );
        }

        LocalDateTime now =
                LocalDateTime.now();

        Customer customer =
                new Customer();

        customer.setFullName(
                request.getFullName().trim()
        );

        customer.setEmail(email);

        customer.setPhoneNumber(phoneNumber);

        // No assessment is assigned
        // when customer is first created
        customer.setIsAssessmentAssigned(false);

        customer.setActive(true);

        customer.setCreatedAt(now);

        customer.setUpdatedAt(now);

        Customer savedCustomer =
                customerRepository.save(customer);

        return mapToResponse(savedCustomer);
    }

    @Override
    public List<CustomerResponse> getAllCustomers() {

        return customerRepository
                .findByActiveTrueOrderByIdAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CustomerResponse mapToResponse(
            Customer customer) {

        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getIsAssessmentAssigned(),
                customer.getActive(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }

    @Override
    public CustomerResponse getCustomerById(Long id) {

        Customer customer =
                customerRepository
                        .findByIdAndActiveTrue(id)
                        .orElseThrow(
                                () ->
                                        new CustomerNotFoundException(
                                                "Customer not found with id: "
                                                        + id
                                        )
                        );

        return mapToResponse(customer);
    }


    @Override
    public CustomerResponse updateCustomer(
            Long id,
            CustomerRequest request) {

        Customer customer =
                customerRepository
                        .findByIdAndActiveTrue(id)
                        .orElseThrow(
                                () ->
                                        new CustomerNotFoundException(
                                                "Customer not found with id: "
                                                        + id
                                        )
                        );

        String email =
                request.getEmail().trim();

        String phoneNumber =
                request.getPhoneNumber().trim();

        if (customerRepository
                .existsByEmailAndIdNot(email, id)) {

            throw new CustomerAlreadyExistsException(
                    "Customer with this email already exists"
            );
        }

        if (customerRepository
                .existsByPhoneNumberAndIdNot(
                        phoneNumber,
                        id
                )) {

            throw new CustomerAlreadyExistsException(
                    "Customer with this phone number already exists"
            );
        }

        customer.setFullName(
                request.getFullName().trim()
        );

        customer.setEmail(email);

        customer.setPhoneNumber(phoneNumber);

        customer.setUpdatedAt(
                LocalDateTime.now()
        );

        Customer updatedCustomer =
                customerRepository.save(customer);

        return mapToResponse(updatedCustomer);
    }
}