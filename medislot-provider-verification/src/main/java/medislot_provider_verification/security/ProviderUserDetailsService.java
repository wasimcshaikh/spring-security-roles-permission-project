package medislot_provider_verification.security;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.entity.Provider;
import medislot_provider_verification.repository.ProviderRepository;
import medislot_provider_verification.service.PermissionService;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProviderUserDetailsService
        implements UserDetailsService {

    private final ProviderRepository providerRepository;

    private final PermissionService permissionService;

    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // 1. Find provider
        Provider provider =
                providerRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Provider not found with email: "
                                                + email
                                )
                        );

        // 2. Get permissions from database
        Set<String> permissions =
                permissionService.getPermissionsForRole(
                        provider.getRole().getName()
                );

        // 3. Create Spring Security user
        return new ProviderUserDetails(
                provider,
                permissions
        );
    }
}