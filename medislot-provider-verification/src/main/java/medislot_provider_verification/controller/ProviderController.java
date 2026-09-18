package medislot_provider_verification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.*;
import medislot_provider_verification.service.ProviderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;


    @PostMapping("/register")
    public ResponseEntity<String> registerProvider(
            @Valid @RequestBody ProviderRegistrationRequest request) {

        providerService.registerProvider(request);

        return ResponseEntity.ok(
                "Registration successful. OTP has been sent to your email."
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        providerService.verifyOtp(request);

        return ResponseEntity.ok(
                "OTP verified successfully. Provider registered successfully."
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody ProviderLoginRequest request) {

        LoginResponse response =
                providerService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ProviderResponse> getMyProfile(
            Authentication authentication) {

        String email = authentication.getName();

        ProviderResponse response =
                providerService.getProviderByEmail(email);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProviderResponse>> getAllProviders() {

        List<ProviderResponse> providers =
                providerService.getAllProviders();

        return ResponseEntity.ok(providers);
    }

    @GetMapping("/registration-roles")
    public ResponseEntity<List<RoleResponse>> getRegistrationRoles() {

        List<RoleResponse> roles =
                providerService.getRegistrationRoles();

        return ResponseEntity.ok(roles);
    }
}