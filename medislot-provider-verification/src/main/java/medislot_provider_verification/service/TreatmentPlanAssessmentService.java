package medislot_provider_verification.service;

import medislot_provider_verification.dto.AssessmentCompletionRequest;
import medislot_provider_verification.dto.TreatmentPlanAssessmentRequest;
import medislot_provider_verification.dto.TreatmentPlanAssessmentResponse;

import java.util.List;

public interface TreatmentPlanAssessmentService {

    TreatmentPlanAssessmentResponse assignAssessment(
            Long customerId,
            TreatmentPlanAssessmentRequest request
    );

    List<TreatmentPlanAssessmentResponse> getCustomerAssessments(
            Long customerId
    );

    TreatmentPlanAssessmentResponse markAssessmentCompleted(
            Long customerId,
            Long treatmentPlanAssessmentId,
            AssessmentCompletionRequest request
    );
}