package medislot_provider_verification.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String role;

    private Boolean verified;
}