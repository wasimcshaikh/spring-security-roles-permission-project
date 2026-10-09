
package medislot_provider_verification.service;

import medislot_provider_verification.dto.TreatmentPlanAssessmentRequest;
import medislot_provider_verification.dto.TreatmentPlanAssessmentResponse;
import medislot_provider_verification.entity.Assessment;
import medislot_provider_verification.entity.Customer;
import medislot_provider_verification.entity.TreatmentPlanAssessment;
import medislot_provider_verification.exception.AssessmentAlreadyAssignedException;
import medislot_provider_verification.exception.AssessmentNotFoundException;
import medislot_provider_verification.exception.CustomerNotFoundException;
import medislot_provider_verification.repository.AssessmentRepository;
import medislot_provider_verification.repository.CustomerRepository;
import medislot_provider_verification.repository.TreatmentPlanAssessmentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TreatmentPlanAssessmentServiceImpl
        implements TreatmentPlanAssessmentService {

    private final CustomerRepository customerRepository;
    private final AssessmentRepository assessmentRepository;
    private final TreatmentPlanAssessmentRepository
            treatmentPlanAssessmentRepository;

    public TreatmentPlanAssessmentServiceImpl(
            CustomerRepository customerRepository,
            AssessmentRepository assessmentRepository,
            TreatmentPlanAssessmentRepository
                    treatmentPlanAssessmentRepository) {

        this.customerRepository = customerRepository;
        this.assessmentRepository = assessmentRepository;
        this.treatmentPlanAssessmentRepository =
                treatmentPlanAssessmentRepository;
    }

    @Override
    @Transactional
    public TreatmentPlanAssessmentResponse assignAssessment(
            Long customerId,
            TreatmentPlanAssessmentRequest request) {

        // 1. Find an active customer
        Customer customer =
                customerRepository
                        .findByIdAndActiveTrue(customerId)
                        .orElseThrow(
                                () -> new CustomerNotFoundException(
                                        "Customer not found with id: "
                                                + customerId
                                )
                        );

        // 2. Find an active assessment
        Assessment assessment =
                assessmentRepository
                        .findByIdAndActiveTrue(
                                request.getAssessmentId()
                        )
                        .orElseThrow(
                                () -> new AssessmentNotFoundException(
                                        "Assessment not found with id: "
                                                + request.getAssessmentId()
                                )
                        );

        // 3. Prevent duplicate active assignments
        boolean alreadyAssigned =
                treatmentPlanAssessmentRepository
                        .existsByCustomer_IdAndAssessment_IdAndActiveTrue(
                                customerId,
                                assessment.getId()
                        );

        if (alreadyAssigned) {
            throw new AssessmentAlreadyAssignedException(
                    "This assessment is already assigned to this customer"
            );
        }

        // 4. Set timestamps and active status in the service
        LocalDateTime now = LocalDateTime.now();

        TreatmentPlanAssessment assignment =
                TreatmentPlanAssessment.builder()
                        .customer(customer)
                        .assessment(assessment)
                        .frequency(request.getFrequency())
                        .frequencyUnit(request.getFrequencyUnit())
                        .active(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();

        // 5. Save the assignment
        TreatmentPlanAssessment savedAssignment =
                treatmentPlanAssessmentRepository.save(assignment);

        // 6. Update the customer flag
        customer.setIsAssessmentAssigned(true);
        customer.setUpdatedAt(now);

        customerRepository.save(customer);

        // 7. Return assignment details
        return mapToResponse(savedAssignment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TreatmentPlanAssessmentResponse> getCustomerAssessments(
            Long customerId) {

        // Confirm that the customer exists and is active
        customerRepository
                .findByIdAndActiveTrue(customerId)
                .orElseThrow(
                        () -> new CustomerNotFoundException(
                                "Customer not found with id: " + customerId
                        )
                );

        // Fetch active assignments for this customer
        return treatmentPlanAssessmentRepository
                .findByCustomer_IdAndActiveTrueOrderByIdAsc(customerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private TreatmentPlanAssessmentResponse mapToResponse(
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
}
