package medislot_provider_verification.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class AssessmentCompletionRequest {

    @NotNull(message = "Completed count is required")
    @Min(value = 0, message = "Completed count cannot be negative")
    private Integer completedCount;

    public Integer getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(Integer completedCount) {
        this.completedCount = completedCount;
    }
}