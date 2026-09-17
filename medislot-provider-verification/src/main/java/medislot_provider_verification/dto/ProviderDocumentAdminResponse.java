package medislot_provider_verification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderDocumentAdminResponse {

    private Long documentId;

    private Long providerId;

    private String providerName;

    private String fileName;

    private String fileSize;

    private LocalDateTime uploadedAt;
}