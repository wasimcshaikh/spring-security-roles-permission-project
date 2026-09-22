package medislot_provider_verification.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import medislot_provider_verification.config.ZoomConfig;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class ZoomVideoSdkService {

    private final ZoomConfig zoomConfig;


    public String generateToken(
            String sessionName,
            String userKey,
            int role
    ) {

        long issuedAt =
                System.currentTimeMillis() / 1000;

        long expirationTime =
                issuedAt + (60 * 60);

        SecretKey secretKey =
                new SecretKeySpec(
                        zoomConfig.getSecret()
                                .getBytes(StandardCharsets.UTF_8),
                        "HmacSHA256"
                );

        return Jwts.builder()

                .claim(
                        "app_key",
                        zoomConfig.getKey()
                )

                .claim(
                        "role_type",
                        role
                )

                .claim(
                        "tpc",
                        sessionName
                )

                .claim(
                        "version",
                        1
                )

                .claim(
                        "user_key",
                        userKey
                )

                .issuedAt(
                        new Date(issuedAt * 1000)
                )

                .expiration(
                        new Date(expirationTime * 1000)
                )

                .signWith(
                        secretKey,
                        SignatureAlgorithm.HS256
                )

                .compact();
    }
}