package medislot_provider_verification.service;

import com.auth0.jwt.JWT;
import lombok.RequiredArgsConstructor;
import medislot_provider_verification.config.ZoomConfig;
import org.springframework.stereotype.Service;
import com.auth0.jwt.algorithms.Algorithm;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ZoomVideoSdkService {

    private final ZoomConfig zoomConfig;
    long iat = Instant.now().getEpochSecond();
    long exp = iat + 60 * 60 * 2;
    String mtgId = "6209119148";
//    public String generateToken(
//            String sessionName,
//            String userIdentity,
//            int role
//    ) {
//
//        long issuedAt =
//                (System.currentTimeMillis() / 1000) - 30;
//
//        long expirationTime =
//                issuedAt + (60 * 60 * 2);
//
//        SecretKey secretKey =
//                new SecretKeySpec(
//                        zoomConfig.getSecret()
//                                .getBytes(StandardCharsets.UTF_8),
//                        "HmacSHA256"
//                );
//
//        return Jwts.builder()
//
//                .claim(
//                        "api_key",
//                        zoomConfig.getKey()
//                )
//
//                .claim(
//                        "tpc",
//                        sessionName
//                )
//
//                .claim(
//                        "role_type",
//                        role
//                )
//
//                .claim(
//                        "user_identity",
//                        userIdentity
//                )
//
//                .claim("iat", iat)
//                .claim("exp", exp)
//                .claim("tokenExp", exp)
//
//                .claim(
//                        "version",
//                        1
//                )
//
//                .issuedAt(
//                        new Date(issuedAt * 1000)
//                )
//
//                .expiration(
//                        new Date(expirationTime * 1000)
//                )
//
//                .signWith(
//                        secretKey,
//                        SignatureAlgorithm.HS256
//                )
//
//                .compact();
//    }

    public String generateToken(
            String sessionName,
            String userIdentity,
            int role
    )  {
        try {
            Algorithm algorithm = Algorithm.HMAC256(zoomConfig.getSecret());


            long expirationSeconds = 3600L;


            return JWT.create()
                    .withHeader(Map.of("alg", "HS256", "typ", "JWT"))
                    .withClaim("sdkKey",zoomConfig.getKey())
                    .withClaim("appKey",zoomConfig.getKey())
                    .withClaim("role", role)
                    .withClaim("mn", mtgId)
                    .withClaim("version", 1)
                    .withIssuedAt(Instant.now())
                    .withExpiresAt(Instant.now().plusSeconds(expirationSeconds))
                    .withClaim("user_identity", userIdentity)
                    .withClaim("session_key", sessionName)
                    .sign(algorithm);


        } catch (Exception e) {

        }


        return "";
    }
}