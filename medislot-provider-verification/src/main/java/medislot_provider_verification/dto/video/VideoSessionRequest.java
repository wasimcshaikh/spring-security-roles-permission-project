package medislot_provider_verification.dto.video;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoSessionRequest {

    @NotBlank(message = "Session name is required")
    @Size(max = 200, message = "Session name cannot exceed 200 characters")
    private String sessionName;
}