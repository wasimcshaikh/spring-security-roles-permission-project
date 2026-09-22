package medislot_provider_verification.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import medislot_provider_verification.entity.Provider;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Getter
@AllArgsConstructor
public class ProviderUserDetails implements UserDetails {

    private final Provider provider;

    private final Set<String> permissions;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        List<GrantedAuthority> authorities =
                new ArrayList<>();

        // ROLE
        authorities.add(
                new SimpleGrantedAuthority(
                        "ROLE_" + provider.getRole().getName()
                )
        );

        // PERMISSIONS
        permissions.forEach(permission ->
                authorities.add(
                        new SimpleGrantedAuthority(permission)
                )
        );

        return authorities;
    }

    @Override
    public String getPassword() {
        return provider.getPassword();
    }

    @Override
    public String getUsername() {
        return provider.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return provider.getVerified();
    }
}