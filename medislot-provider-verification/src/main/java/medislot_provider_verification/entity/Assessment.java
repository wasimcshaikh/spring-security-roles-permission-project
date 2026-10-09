package medislot_provider_verification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "assessment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "name",
            nullable = false,
            length = 150
    )
    private String name;

    @Column(
            name = "organisation",
            nullable = false,
            length = 150
    )
    private String organisation;

    @Column(
            name = "file_name",
            nullable = false,
            length = 255
    )
    private String fileName;

    @Column(
            name = "file_type",
            nullable = false,
            length = 100
    )
    private String fileType;

    @Column(
            name = "file_data",
            nullable = false,
            columnDefinition = "BYTEA"
    )
    private byte[] fileData;

    @Column(
            name = "active",
            nullable = false
    )
    private Boolean active;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;
}