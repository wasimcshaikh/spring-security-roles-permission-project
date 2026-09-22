package medislot_provider_verification.service;

import medislot_provider_verification.dto.video.CreateVideoCallRequest;
import medislot_provider_verification.dto.video.VideoCallResponse;
import medislot_provider_verification.dto.video.VideoSessionResponse;

import java.util.List;

public interface VideoCallService {

    VideoCallResponse createVideoCall(
            CreateVideoCallRequest request,
            Long createdBy
    );

    List<VideoCallResponse> getAllVideoCalls();

    List<VideoCallResponse> getProviderVideoCalls(
            Long providerId
    );

    List<VideoCallResponse> getClientVideoCalls(
            Long clientId
    );

    VideoCallResponse getVideoCallById(Long id);

    VideoSessionResponse joinVideoCall(
            Long videoCallId,
            Long userId,
            String role
    );
}