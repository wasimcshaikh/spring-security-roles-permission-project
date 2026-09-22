package medislot_provider_verification.service;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.video.CreateVideoCallRequest;
import medislot_provider_verification.dto.video.VideoCallResponse;
import medislot_provider_verification.dto.video.VideoSessionResponse;
import medislot_provider_verification.entity.VideoCall;
import medislot_provider_verification.entity.VideoCallStatus;
import medislot_provider_verification.repository.VideoCallRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VideoCallServiceImpl
        implements VideoCallService {

    private final VideoCallRepository videoCallRepository;
    private final ZoomVideoSdkService zoomVideoSdkService;

    @Override
    @Transactional
    public VideoCallResponse createVideoCall(
            CreateVideoCallRequest request,
            Long createdBy) {

        String sessionName =
                "medislot-" + UUID.randomUUID();

        String sessionPasscode =
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8);

        VideoCall videoCall =
                VideoCall.builder()
                        .providerId(request.getProviderId())
                        .clientId(request.getClientId())
                        .createdBy(createdBy)
                        .sessionName(sessionName)
                        .sessionPasscode(sessionPasscode)
                        .scheduledAt(request.getScheduledAt())
                        .durationMinutes(request.getDurationMinutes())
                        .status(VideoCallStatus.SCHEDULED)
                        .createdAt(java.time.LocalDateTime.now())
                        .updatedAt(java.time.LocalDateTime.now())
                        .build();

        VideoCall saved =
                videoCallRepository.save(videoCall);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VideoCallResponse> getAllVideoCalls() {

        return videoCallRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VideoCallResponse> getProviderVideoCalls(
            Long providerId) {

        return videoCallRepository
                .findByProviderId(providerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VideoCallResponse> getClientVideoCalls(
            Long clientId) {

        return videoCallRepository
                .findByClientId(clientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public VideoCallResponse getVideoCallById(Long id) {

        VideoCall videoCall =
                videoCallRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Video call not found with id: " + id
                                )
                        );

        return mapToResponse(videoCall);
    }

    private VideoCallResponse mapToResponse(
            VideoCall videoCall) {

        return VideoCallResponse.builder()
                .id(videoCall.getId())
                .providerId(videoCall.getProviderId())
                .clientId(videoCall.getClientId())
                .createdBy(videoCall.getCreatedBy())
                .sessionName(videoCall.getSessionName())
                .scheduledAt(videoCall.getScheduledAt())
                .durationMinutes(videoCall.getDurationMinutes())
                .status(videoCall.getStatus().name())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public VideoSessionResponse joinVideoCall(
            Long videoCallId,
            Long userId,
            String role) {

        VideoCall videoCall =
                videoCallRepository.findById(videoCallId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Video call not found with id: "
                                                + videoCallId
                                )
                        );

        boolean isAdmin =
                "ADMIN".equals(role)
                        && videoCall.getCreatedBy().equals(userId);

        boolean isProvider =
                "PROVIDER".equals(role)
                        && videoCall.getProviderId().equals(userId);

        boolean isClient =
                "CLIENT".equals(role)
                        && videoCall.getClientId().equals(userId);

        if (!isAdmin && !isProvider && !isClient) {
            throw new RuntimeException(
                    "You are not allowed to join this video call"
            );
        }

        int zoomRole =
                "ADMIN".equals(role) ? 1 : 0;

        String userKey =
                role + "-" + userId;

        String token =
                zoomVideoSdkService.generateToken(
                        videoCall.getSessionName(),
                        userKey,
                        zoomRole
                );

        long expiresAt =
                (System.currentTimeMillis() / 1000)
                        + (60 * 60);

        return new VideoSessionResponse(
                videoCall.getSessionName(),
                token,
                zoomRole,
                expiresAt
        );
    }
}