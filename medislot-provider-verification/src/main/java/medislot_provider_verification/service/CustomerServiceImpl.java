
package medislot_provider_verification.service;

import medislot_provider_verification.dto.CustomerRequest;
import medislot_provider_verification.dto.CustomerResponse;
import medislot_provider_verification.dto.TreatmentPlanAssessmentRequest;
import medislot_provider_verification.dto.TreatmentPlanAssessmentResponse;

import medislot_provider_verification.entity.Assessment;
import medislot_provider_verification.entity.Customer;
import medislot_provider_verification.entity.TreatmentPlanAssessment;

import medislot_provider_verification.exception.AssessmentAlreadyAssignedException;
import medislot_provider_verification.exception.AssessmentNotFoundException;
import medislot_provider_verification.exception.CustomerAlreadyExistsException;
import medislot_provider_verification.exception.CustomerNotFoundException;

import medislot_provider_verification.repository.AssessmentRepository;
import medislot_provider_verification.repository.CustomerRepository;
import medislot_provider_verification.repository.TreatmentPlanAssessmentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final AssessmentRepository assessmentRepository;
    private final TreatmentPlanAssessmentRepository treatmentPlanAssessmentRepository;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            AssessmentRepository assessmentRepository,
            TreatmentPlanAssessmentRepository treatmentPlanAssessmentRepository) {

        this.customerRepository = customerRepository;
        this.assessmentRepository = assessmentRepository;
        this.treatmentPlanAssessmentRepository = treatmentPlanAssessmentRepository;
    }

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {

        String email = request.getEmail().trim();
        String phoneNumber = request.getPhoneNumber().trim();

        if (customerRepository.existsByEmail(email)) {
            throw new CustomerAlreadyExistsException(
                    "Customer with this email already exists");
        }

        if (customerRepository.existsByPhoneNumber(phoneNumber)) {
            throw new CustomerAlreadyExistsException(
                    "Customer with this phone number already exists");
        }

        List<TreatmentPlanAssessmentRequest> requestedAssessments =
                request.getTreatmentPlanAssessments();

        if (requestedAssessments == null) {
            requestedAssessments = List.of();
        }

        // Validate duplicate assessment IDs before saving anything.
        Set<Long> assessmentIds = new HashSet<>();

        for (TreatmentPlanAssessmentRequest assessmentRequest : requestedAssessments) {
            if (!assessmentIds.add(assessmentRequest.getAssessmentId())) {
                throw new AssessmentAlreadyAssignedException(
                        "The same assessment cannot be included more than once");
            }
        }

        LocalDateTime now = LocalDateTime.now();

        Customer customer = new Customer();
        customer.setFullName(request.getFullName().trim());
        customer.setEmail(email);
        customer.setPhoneNumber(phoneNumber);
        customer.setIsAssessmentAssigned(!requestedAssessments.isEmpty());
        customer.setActive(true);
        customer.setCreatedAt(now);
        customer.setUpdatedAt(now);

        Customer savedCustomer = customerRepository.save(customer);

        List<TreatmentPlanAssessmentResponse> assignmentResponses =
                new ArrayList<>();

        for (TreatmentPlanAssessmentRequest assessmentRequest : requestedAssessments) {

            Assessment assessment = assessmentRepository
                    .findByIdAndActiveTrue(assessmentRequest.getAssessmentId())
                    .orElseThrow(() -> new AssessmentNotFoundException(
                            "Active assessment not found with id: "
                                    + assessmentRequest.getAssessmentId()));

            TreatmentPlanAssessment assignment = TreatmentPlanAssessment.builder()
                    .customer(savedCustomer)
                    .assessment(assessment)
                    .frequency(assessmentRequest.getFrequency())
                    .frequencyUnit(assessmentRequest.getFrequencyUnit())
                    .active(true)
                    .createdAt(now)
                    .updatedAt(now)
                    .build();

            TreatmentPlanAssessment savedAssignment =
                    treatmentPlanAssessmentRepository.save(assignment);

            assignmentResponses.add(mapAssignmentToResponse(savedAssignment));
        }

        return mapToResponse(savedCustomer, assignmentResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {

        return customerRepository
                .findByActiveTrueOrderByIdAsc()
                .stream()
                .map(customer -> mapToResponse(
                        customer,
                        getActiveAssignmentResponses(customer.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {

        Customer customer = customerRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() -> new CustomerNotFoundException(
                        "Customer not found with id: " + id));

        return mapToResponse(
                customer,
                getActiveAssignmentResponses(customer.getId()));
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(
            Long id,
            CustomerRequest request) {

        Customer customer = customerRepository
                .findByIdAndActiveTrue(id)
                .orElseThrow(() -> new CustomerNotFoundException(
                        "Customer not found with id: " + id));

        String email = request.getEmail().trim();
        String phoneNumber = request.getPhoneNumber().trim();

        if (customerRepository.existsByEmailAndIdNot(email, id)) {
            throw new CustomerAlreadyExistsException(
                    "Customer with this email already exists");
        }

        if (customerRepository.existsByPhoneNumberAndIdNot(phoneNumber, id)) {
            throw new CustomerAlreadyExistsException(
                    "Customer with this phone number already exists");
        }

        customer.setFullName(request.getFullName().trim());
        customer.setEmail(email);
        customer.setPhoneNumber(phoneNumber);
        customer.setUpdatedAt(LocalDateTime.now());

        Customer updatedCustomer = customerRepository.save(customer);

        // Customer update only changes customer details.
        // Assessment assignments are preserved.
        return mapToResponse(
                updatedCustomer,
                getActiveAssignmentResponses(updatedCustomer.getId()));
    }

    private List<TreatmentPlanAssessmentResponse> getActiveAssignmentResponses(
            Long customerId) {

        return treatmentPlanAssessmentRepository
                .findByCustomer_IdAndActiveTrueOrderByIdAsc(customerId)
                .stream()
                .map(this::mapAssignmentToResponse)
                .toList();
    }

    private TreatmentPlanAssessmentResponse mapAssignmentToResponse(
            TreatmentPlanAssessment assignment) {

        return new TreatmentPlanAssessmentResponse(
                assignment.getId(),
                assignment.getCustomer().getId(),
                assignment.getAssessment().getId(),
                assignment.getAssessment().getName(),
                assignment.getAssessment().getOrganisation(),
                assignment.getFrequency(),
                assignment.getFrequencyUnit(),
                assignment.getActive(),
                assignment.getCreatedAt(),
                assignment.getUpdatedAt()
        );
    }

    private CustomerResponse mapToResponse(
            Customer customer,
            List<TreatmentPlanAssessmentResponse> assignments) {

        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getIsAssessmentAssigned(),
                customer.getActive(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
//                assignments
        );
    }
}
