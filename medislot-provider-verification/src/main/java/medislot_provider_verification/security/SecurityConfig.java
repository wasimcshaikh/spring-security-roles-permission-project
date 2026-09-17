package medislot_provider_verification.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;


    @Bean
    public PasswordEncoder passwordEncoder() {

        return NoOpPasswordEncoder.getInstance();
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }


    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    /*
     * =========================
     * CORS CONFIGURATION
     * =========================
     */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        /*
         * React frontend
         */

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );


        /*
         * HTTP methods allowed
         */

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );


        /*
         * Headers allowed from frontend
         */

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );


        /*
         * Allow credentials
         */

        configuration.setAllowCredentials(true);


        /*
         * Apply configuration to all APIs
         */

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =========================
                // CORS
                // =========================
                .cors(cors -> {})


                // =========================
                // CSRF
                // =========================
                .csrf(csrf -> csrf.disable())


                // =========================
                // SESSION MANAGEMENT
                // =========================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =========================
                // EXCEPTION HANDLING
                // =========================
                .exceptionHandling(exception -> exception

                        // 401 - Not authenticated
                        .authenticationEntryPoint(
                                customAuthenticationEntryPoint
                        )

                        // 403 - Authenticated but not authorized
                        .accessDeniedHandler(
                                customAccessDeniedHandler
                        )
                )


                // =========================
                // AUTHORIZATION RULES
                // =========================
                .authorizeHttpRequests(auth -> auth


                        // =========================
                        // PUBLIC APIs
                        // =========================
                        .requestMatchers(
                                "/api/providers/register",
                                "/api/providers/verify-otp",
                                "/api/providers/login"
                        )
                        .permitAll()

                        // =========================
                        // view my profile
                        // =========================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/providers/me"
                        )
                        .hasAuthority("VIEW_PROFILE")
                        // =========================
                        // DOCUMENT UPLOAD
                        // =========================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/providers/documents"
                        )
                        .hasAuthority(
                                "UPLOAD_DOCUMENT"
                        )

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/providers"
                        )
                        .hasAuthority("VIEW_PROVIDERS")


                        // =========================
                        // VIEW DOCUMENTS
                        // =========================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/providers/documents"
                        )
                        .hasAuthority("VIEW_PROVIDER_DETAILS")
                        
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/providers/documents/**"
                        )
                        .hasAuthority(
                                "VIEW_DOCUMENTS"
                        )


                        // =========================
                        // DELETE DOCUMENT
                        // =========================
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/providers/documents/**"
                        )
                        .hasAuthority(
                                "DELETE_DOCUMENT"
                        )


                        // =========================
                        // ADMIN EXPORT
                        // =========================
                        .requestMatchers(
                                "/api/admin/export/**"
                        )
                        .hasAuthority(
                                "EXPORT_PROVIDERS"
                        )



                        // =========================
                        // ALL OTHER APIs
                        // =========================
                        .anyRequest()
                        .authenticated()
                )





                // =========================
                // JWT FILTER
                // =========================
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}