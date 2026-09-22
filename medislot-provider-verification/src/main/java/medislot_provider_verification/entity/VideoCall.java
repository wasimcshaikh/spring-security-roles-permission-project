package medislot_provider_verification.entity;

import jakarta.persistence.*;import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "video_call")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoCall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_id", nullable = false)
    private Long providerId;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "session_name", nullable = false, unique = true)
    private String sessionName;

    @Column(name = "session_passcode", nullable = false)
    private String sessionPasscode;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private VideoCallStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}