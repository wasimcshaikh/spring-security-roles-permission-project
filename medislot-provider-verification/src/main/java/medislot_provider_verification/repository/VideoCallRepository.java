package medislot_provider_verification.repository;

import medislot_provider_verification.entity.VideoCall;
import medislot_provider_verification.entity.VideoCallStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoCallRepository
        extends JpaRepository<VideoCall, Long> {

    List<VideoCall> findByProviderId(Long providerId);

    List<VideoCall> findByClientId(Long clientId);

    List<VideoCall> findByCreatedBy(Long createdBy);

    List<VideoCall> findByStatus(VideoCallStatus status);
}