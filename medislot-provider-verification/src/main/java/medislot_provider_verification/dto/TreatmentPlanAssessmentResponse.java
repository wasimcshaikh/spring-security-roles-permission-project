package medislot_provider_verification.dto;

import medislot_provider_verification.entity.FrequencyUnit;

import java.time.LocalDateTime;

public class TreatmentPlanAssessmentResponse {

    private Long id;
    private Long customerId;
    private Long assessmentId;
    private String assessmentName;
    private String organisation;
    private Integer frequency;
    private FrequencyUnit frequencyUnit;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TreatmentPlanAssessmentResponse(
            Long id,
            Long customerId,
            Long assessmentId,
            String assessmentName,
            String organisation,
            Integer frequency,
            FrequencyUnit frequencyUnit,
            Boolean active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.customerId = customerId;
        this.assessmentId = assessmentId;
        this.assessmentName = assessmentName;
        this.organisation = organisation;
        this.frequency = frequency;
        this.frequencyUnit = frequencyUnit;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public Long getAssessmentId() {
        return assessmentId;
    }

    public String getAssessmentName() {
        return assessmentName;
    }

    public String getOrganisation() {
        return organisation;
    }

    public Integer getFrequency() {
        return frequency;
    }

    public FrequencyUnit getFrequencyUnit() {
        return frequencyUnit;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}