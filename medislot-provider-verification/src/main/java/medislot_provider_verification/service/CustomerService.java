package medislot_provider_verification.service;

import medislot_provider_verification.dto.CustomerRequest;
import medislot_provider_verification.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {

    CustomerResponse createCustomer(
            CustomerRequest request
    );

    List<CustomerResponse> getAllCustomers();

    CustomerResponse getCustomerById(Long id);

    CustomerResponse updateCustomer(
            Long id,
            CustomerRequest request
    );
}