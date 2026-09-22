package medislot_provider_verification.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "zoom.sdk")
@Getter
@Setter
public class ZoomConfig {

    private String key;

    private String secret;
}