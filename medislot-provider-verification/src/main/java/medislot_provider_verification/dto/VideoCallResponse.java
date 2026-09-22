package medislot_provider_verification.dto.video;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class VideoCallResponse {

    private Long id;

    private Long providerId;

    private Long clientId;

    private Long createdBy;

    private String sessionName;

    private LocalDateTime scheduledAt;

    private Integer durationMinutes;

    private String status;
}