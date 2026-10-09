package medislot_provider_verification.controller;

import jakarta.validation.Valid;
import medislot_provider_verification.dto.TreatmentPlanAssessmentRequest;
import medislot_provider_verification.dto.TreatmentPlanAssessmentResponse;
import medislot_provider_verification.service.TreatmentPlanAssessmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers/assessments/{customerId}")
public class TreatmentPlanAssessmentController {

    private final TreatmentPlanAssessmentService
            treatmentPlanAssessmentService;

    public TreatmentPlanAssessmentController(
            TreatmentPlanAssessmentService
                    treatmentPlanAssessmentService) {

        this.treatmentPlanAssessmentService =
                treatmentPlanAssessmentService;
    }

    @PostMapping
    public ResponseEntity<TreatmentPlanAssessmentResponse>
    assignAssessment(
            @PathVariable Long customerId,
            @Valid @RequestBody
            TreatmentPlanAssessmentRequest request) {

        TreatmentPlanAssessmentResponse response =
                treatmentPlanAssessmentService.assignAssessment(
                        customerId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<TreatmentPlanAssessmentResponse>>
    getCustomerAssessments(
            @PathVariable Long customerId) {

        return ResponseEntity.ok(
                treatmentPlanAssessmentService
                        .getCustomerAssessments(customerId)
        );
    }
}