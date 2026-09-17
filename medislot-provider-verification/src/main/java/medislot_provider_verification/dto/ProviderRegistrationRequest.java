package medislot_provider_verification.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import medislot_provider_verification.entity.Role;

@Getter
@Setter
public class ProviderRegistrationRequest {

    @NotBlank(message = "Full name is required")
    @Size(
            max = 100,
            message = "Full name cannot exceed 100 characters"
    )
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(
            max = 255,
            message = "Email cannot exceed 255 characters"
    )
    private String email;

    @Size(
            max = 20,
            message = "Phone number cannot exceed 20 characters"
    )
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(
            min = 8,
            max = 100,
            message = "Password must be between 8 and 100 characters"
    )
    private String password;

    @NotNull(message = "Role is required")
    private Role role;
}