package medislot_provider_verification.service;

import medislot_provider_verification.dto.AssessmentByIdResponse;
import medislot_provider_verification.dto.AssessmentRequest;
import medislot_provider_verification.dto.AssessmentResponse;
import java.util.List;

public interface AssessmentService {

    AssessmentResponse createAssessment(
            AssessmentRequest request
    );

    AssessmentResponse updateAssessment(
            Long id,
            AssessmentRequest request
    );

    List<AssessmentResponse> getAllAssessments();

    void deactivateAssessment(Long id);

    AssessmentByIdResponse getAssessmentById(Long id);
}