//package medislot_provider_verification.controller;
//
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import medislot_provider_verification.dto.video.VideoSessionRequest;
//import medislot_provider_verification.dto.video.VideoSessionResponse;
//import medislot_provider_verification.security.ProviderUserDetails;
//import medislot_provider_verification.service.ZoomVideoSdkService;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/video")
//@RequiredArgsConstructor
//public class VideoSessionController {
//
//    private final ZoomVideoSdkService zoomVideoSdkService;
//
//
//    @PostMapping("/token")
//    public ResponseEntity<VideoSessionResponse> createSession(
//            @Valid @RequestBody VideoSessionRequest request,
//            Authentication authentication
//    ) {
//
//        String email = authentication.getName();
//
//        String token =
//                zoomVideoSdkService.generateToken(
//                        request.getSessionName(),
//                        email,
//                        1
//                );
//
//        long expiresAt =
//                (System.currentTimeMillis() / 1000)
//                        + (60 * 60);
//
//        VideoSessionResponse response =
//                new VideoSessionResponse(
//                        request.getSessionName(),
//                        token,
//                        1,
//                        expiresAt
//                );
//
//        return ResponseEntity.ok(response);
//    }
//}