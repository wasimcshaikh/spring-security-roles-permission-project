
package medislot_provider_verification.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CustomerRequest {

    @NotBlank(message = "Customer name is required")
    private String fullName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Customer phone number is required")
    private String phoneNumber;

    @Valid
    private List<TreatmentPlanAssessmentRequest> treatmentPlanAssessments;

    public CustomerRequest() {
    }

    public CustomerRequest(
            String fullName,
            String email,
            String phoneNumber,
            List<TreatmentPlanAssessmentRequest> treatmentPlanAssessments) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.treatmentPlanAssessments = treatmentPlanAssessments;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public List<TreatmentPlanAssessmentRequest> getTreatmentPlanAssessments() {
        return treatmentPlanAssessments;
    }

    public void setTreatmentPlanAssessments(
            List<TreatmentPlanAssessmentRequest> treatmentPlanAssessments) {
        this.treatmentPlanAssessments = treatmentPlanAssessments;
    }
}
