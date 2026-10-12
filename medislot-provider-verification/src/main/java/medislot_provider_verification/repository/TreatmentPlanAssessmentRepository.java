package medislot_provider_verification.repository;

import medislot_provider_verification.entity.TreatmentPlanAssessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TreatmentPlanAssessmentRepository
        extends JpaRepository<TreatmentPlanAssessment, Long> {

    List<TreatmentPlanAssessment>
    findByCustomer_IdAndActiveTrueOrderByIdAsc(Long customerId);

    Optional<TreatmentPlanAssessment>
    findByIdAndCustomer_IdAndActiveTrue(
            Long id,
            Long customerId
    );

    boolean existsByCustomer_IdAndAssessment_IdAndActiveTrue(
            Long customerId,
            Long assessmentId
    );

    List<TreatmentPlanAssessment>
    findByCustomer_IdAndActiveTrueAndRemainingCountGreaterThanOrderByIdAsc(
            Long customerId,
            Integer remainingCount
    );

    Optional<TreatmentPlanAssessment>
    findByCustomer_IdAndAssessment_IdAndActiveTrue(
            Long customerId,
            Long assessmentId
    );
}