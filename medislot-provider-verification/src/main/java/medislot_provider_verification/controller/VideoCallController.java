package medislot_provider_verification.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.video.CreateVideoCallRequest;
import medislot_provider_verification.dto.video.VideoCallResponse;
import medislot_provider_verification.dto.video.VideoSessionResponse;
import medislot_provider_verification.security.ProviderUserDetails;
import medislot_provider_verification.service.VideoCallService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/video-calls")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class VideoCallController {

    private final VideoCallService videoCallService;

    @PostMapping
    public ResponseEntity<VideoCallResponse> createVideoCall(
            @Valid @RequestBody CreateVideoCallRequest request,
            Authentication authentication) {

        ProviderUserDetails userDetails =
                (ProviderUserDetails)
                        authentication.getPrincipal();

        Long adminId =
                userDetails.getProvider().getId();

        VideoCallResponse response =
                videoCallService.createVideoCall(
                        request,
                        adminId
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<VideoCallResponse>>
    getAllVideoCalls() {

        return ResponseEntity.ok(
                videoCallService.getAllVideoCalls()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoCallResponse>
    getVideoCall(@PathVariable Long id) {

        return ResponseEntity.ok(
                videoCallService.getVideoCallById(id)
        );
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<VideoSessionResponse> joinVideoCall(
            @PathVariable Long id,
            Authentication authentication) {

        ProviderUserDetails userDetails =
                (ProviderUserDetails)
                        authentication.getPrincipal();

        Long userId =
                userDetails.getProvider().getId();

        String role =
                userDetails.getProvider()
                        .getRole()
                        .getName();

        VideoSessionResponse response =
                videoCallService.joinVideoCall(
                        id,
                        userId,
                        role
                );

        return ResponseEntity.ok(response);
    }
}