package medislot_provider_verification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class AssessmentByIdResponse {

    private Long id;

    private String name;

    private String organisation;

    private String fileName;

    private String fileType;

    private byte[] fileData;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}