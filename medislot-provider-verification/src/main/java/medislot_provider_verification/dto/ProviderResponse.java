package medislot_provider_verification.dto;

import lombok.*;
import medislot_provider_verification.entity.Role;

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

    private Role role;

    private Boolean verified;
}