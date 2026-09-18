package medislot_provider_verification.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;
    private Boolean verified;
    private Set<String> permissions;
}