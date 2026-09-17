package medislot_provider_verification.service;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.*;
import medislot_provider_verification.entity.Provider;
import medislot_provider_verification.entity.ProviderRegistration;
import medislot_provider_verification.entity.Role;
import medislot_provider_verification.exception.*;
import medislot_provider_verification.repository.ProviderRegistrationRepository;
import medislot_provider_verification.repository.ProviderRepository;
import medislot_provider_verification.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRegistrationRepository providerRegistrationRepository;
    private final ProviderRepository providerRepository;
    private final EmailService emailService;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private final PermissionService permissionService;

    @Override
    public void registerProvider(ProviderRegistrationRequest request) {

        // 1. Check whether provider already exists
        if (providerRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new EmailAlreadyExistsException(
                    "Email is already registered"
            );
        }

        // 2. Check whether registration is already in progress
        if (providerRegistrationRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new EmailAlreadyExistsException(
                    "Registration is already in progress for this email"
            );
        }

        // 3. Generate OTP
        String otp = generateOtp();

        // 4. Create temporary registration
        ProviderRegistration registration =
                ProviderRegistration.builder()
                        .fullName(request.getFullName())
                        .email(request.getEmail())
                        .phoneNumber(request.getPhoneNumber())
                        .password(request.getPassword())
                        .role(request.getRole())
                        .otp(otp)
                        .otpExpiresAt(
                                LocalDateTime.now().plusMinutes(5)
                        )
                        .otpAttempts(0)
                        .createdAt(LocalDateTime.now())
                        .build();

        // 5. Save registration
        providerRegistrationRepository.save(registration);

        // 6. Send OTP to provider's email
        emailService.sendOtpEmail(
                request.getEmail(),
                otp
        );
    }

    @Override
    public void verifyOtp(VerifyOtpRequest request) {

        // 1. Find pending registration using email
        ProviderRegistration registration =
                providerRegistrationRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RegistrationNotFoundException(
                                        "No pending registration found for this email"
                                )
                        );

        // 2. Check whether OTP has expired
        if (LocalDateTime.now()
                .isAfter(registration.getOtpExpiresAt())) {

            throw new OtpExpiredException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        // 3. Check whether OTP is correct
        if (!registration.getOtp().equals(request.getOtp())) {

            registration.setOtpAttempts(
                    registration.getOtpAttempts() + 1
            );

            providerRegistrationRepository.save(registration);

            throw new InvalidOtpException(
                    "Invalid OTP"
            );
        }

        // 4. OTP is correct → create permanent Provider
        Provider provider = Provider.builder()
                .fullName(registration.getFullName())
                .email(registration.getEmail())
                .phoneNumber(registration.getPhoneNumber())
                .password(registration.getPassword())
                .role(registration.getRole())
                .verified(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // 5. Save permanent Provider
        providerRepository.save(provider);

        // 6. Delete temporary registration
        providerRegistrationRepository.delete(registration);
    }

    private String generateOtp() {

        int otp = 100000 + new Random().nextInt(900000);

        return String.valueOf(otp);
    }

    @Override
    public LoginResponse login(ProviderLoginRequest request) {

        // 1. Check whether email exists
        Provider provider =
                providerRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "Email address is not registered"
                                )
                        );

        // 2. Authenticate password
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (BadCredentialsException exception) {

            throw new InvalidCredentialsException(
                    "Incorrect password"
            );
        }

        // 3. Get permissions from database
        Set<String> permissions =
                permissionService.getPermissionsForRole(
                        provider.getRole().name()
                );

        // 4. Generate JWT
        String token =
                jwtService.generateToken(provider);

        // 5. Return provider information + permissions
        return LoginResponse.builder()
                .token(token)
                .id(provider.getId())
                .fullName(provider.getFullName())
                .email(provider.getEmail())
                .phoneNumber(provider.getPhoneNumber())
                .role(provider.getRole())
                .verified(provider.getVerified())
                .permissions(permissions)
                .build();
    }


    @Override
    public ProviderResponse getProviderById(Long providerId) {

        Provider provider =
                providerRepository.findById(providerId)
                        .orElseThrow(() ->
                                new ProviderNotFoundException(
                                        "Provider not found with id: " + providerId
                                )
                        );

        return ProviderResponse.builder()
                .id(provider.getId())
                .fullName(provider.getFullName())
                .email(provider.getEmail())
                .phoneNumber(provider.getPhoneNumber())
                .role(provider.getRole())
                .verified(provider.getVerified())
                .build();
    }


    @Override
    public ProviderResponse getProviderByEmail(String email) {

        Provider provider =
                providerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ProviderNotFoundException(
                                        "Provider not found"
                                )
                        );

        return ProviderResponse.builder()
                .id(provider.getId())
                .fullName(provider.getFullName())
                .email(provider.getEmail())
                .phoneNumber(provider.getPhoneNumber())
                .role(provider.getRole())
                .verified(provider.getVerified())
                .build();
    }

    @Override
    public List<ProviderResponse> getAllProviders() {

        List<Provider> providers =
                providerRepository.findByRole(Role.PROVIDER);

        return providers.stream()
                .map(provider -> ProviderResponse.builder()
                        .id(provider.getId())
                        .fullName(provider.getFullName())
                        .email(provider.getEmail())
                        .phoneNumber(provider.getPhoneNumber())
                        .role(provider.getRole())
                        .verified(provider.getVerified())
                        .build())
                .toList();
    }


}