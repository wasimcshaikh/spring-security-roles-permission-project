
package medislot_provider_verification.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CustomerResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Boolean isAssessmentAssigned;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

//    private List<TreatmentPlanAssessmentResponse> treatmentPlanAssessments;

    public CustomerResponse(
            Long id,
            String fullName,
            String email,
            String phoneNumber,
            Boolean isAssessmentAssigned,
            Boolean active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
//            List<TreatmentPlanAssessmentResponse> treatmentPlanAssessments
            )
            {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.isAssessmentAssigned = isAssessmentAssigned;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
//        this.treatmentPlanAssessments = treatmentPlanAssessments;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

//    public Boolean getIsAssessmentAssigned() {
//        return isAssessmentAssigned;
//    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

//    public List<TreatmentPlanAssessmentResponse> getTreatmentPlanAssessments() {
//        return treatmentPlanAssessments;
//    }
}
