package medislot_provider_verification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class AssessmentResponse {

    private Long id;

    private String name;

    private String organisation;

    private String fileName;

    private String fileType;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}