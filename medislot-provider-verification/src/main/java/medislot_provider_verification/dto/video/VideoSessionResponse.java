package medislot_provider_verification.dto.video;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VideoSessionResponse {

    private String sessionName;

    private String token;

    private int role;

    private long expiresAt;
}