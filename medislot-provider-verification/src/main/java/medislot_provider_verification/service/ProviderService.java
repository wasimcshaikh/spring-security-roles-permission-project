package medislot_provider_verification.service;

import medislot_provider_verification.dto.*;

import java.util.List;

public interface ProviderService {

    void registerProvider(ProviderRegistrationRequest request);

    void verifyOtp(VerifyOtpRequest request);

    LoginResponse login(ProviderLoginRequest request);

    ProviderResponse getProviderById(
            Long providerId
    );

    ProviderResponse getProviderByEmail(String email);

    List<ProviderResponse> getAllProviders();

    List<RoleResponse> getRegistrationRoles();

}