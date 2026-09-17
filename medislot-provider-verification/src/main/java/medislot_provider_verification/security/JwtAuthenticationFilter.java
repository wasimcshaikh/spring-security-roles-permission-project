package medislot_provider_verification.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final ProviderUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Get Authorization header
        String authorizationHeader =
                request.getHeader("Authorization");

        // 2. Check whether Authorization header exists
        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extract JWT
        String token =
                authorizationHeader.substring(7);

        // 4. Extract email from JWT
        String email = jwtService.extractEmail(token);

        // 5. Check whether user is not already authenticated
        if (email != null &&
                SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            // 6. Load provider from database
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            // 7. Validate JWT
            if (jwtService.isTokenValid(token)) {

                // 8. Create Authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // 9. Add request details
                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                System.out.println(
                        "Authenticated user: " +
                                userDetails.getUsername()
                );

                System.out.println(
                        "Authorities: " +
                                userDetails.getAuthorities()
                );

                // 10. Store authentication in SecurityContext
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }
        }

        // 11. Continue request
        filterChain.doFilter(request, response);
    }
}