package medislot_provider_verification.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import medislot_provider_verification.entity.FrequencyUnit;

public class TreatmentPlanAssessmentRequest {

    @NotNull(message = "Assessment ID is required")
    @Positive(message = "Assessment ID must be positive")
    private Long assessmentId;

    @NotNull(message = "Frequency is required")
    @Positive(message = "Frequency must be greater than zero")
    private Integer frequency;

    @NotNull(message = "Frequency unit is required")
    private FrequencyUnit frequencyUnit;

    public Long getAssessmentId() {
        return assessmentId;
    }

    public void setAssessmentId(Long assessmentId) {
        this.assessmentId = assessmentId;
    }

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }

    public FrequencyUnit getFrequencyUnit() {
        return frequencyUnit;
    }

    public void setFrequencyUnit(FrequencyUnit frequencyUnit) {
        this.frequencyUnit = frequencyUnit;
    }
}