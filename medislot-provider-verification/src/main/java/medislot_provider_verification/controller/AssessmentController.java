package medislot_provider_verification.controller;

import jakarta.validation.Valid;
import medislot_provider_verification.dto.AssessmentByIdResponse;
import medislot_provider_verification.dto.AssessmentRequest;
import medislot_provider_verification.dto.AssessmentResponse;
import medislot_provider_verification.service.AssessmentService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(
            AssessmentService assessmentService) {

        this.assessmentService =
                assessmentService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<AssessmentResponse> createAssessment(
            @Valid @ModelAttribute AssessmentRequest request) {

        AssessmentResponse response =
                assessmentService.createAssessment(
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<AssessmentResponse> updateAssessment(
            @PathVariable Long id,
           @Valid @ModelAttribute AssessmentRequest request) {

        AssessmentResponse response =
                assessmentService.updateAssessment(
                        id,
                        request
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AssessmentResponse>>
    getAllAssessments() {

        return ResponseEntity.ok(
                assessmentService.getAllAssessments()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateAssessment(
            @PathVariable Long id) {

        assessmentService.deactivateAssessment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentByIdResponse> getAssessmentById(
            @PathVariable Long id) {

        AssessmentByIdResponse response =
                assessmentService.getAssessmentById(id);

        return ResponseEntity.ok(response);
    }
}