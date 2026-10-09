package medislot_provider_verification.service;

import medislot_provider_verification.dto.AssessmentByIdResponse;
import medislot_provider_verification.dto.AssessmentRequest;
import medislot_provider_verification.dto.AssessmentResponse;
import medislot_provider_verification.entity.Assessment;
import medislot_provider_verification.exception.AssessmentAlreadyExistsException;
import medislot_provider_verification.exception.AssessmentFileRequiredException;
import medislot_provider_verification.exception.AssessmentNotFoundException;
import medislot_provider_verification.repository.AssessmentRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssessmentServiceImpl
        implements AssessmentService {

    private final AssessmentRepository assessmentRepository;

    public AssessmentServiceImpl(
            AssessmentRepository assessmentRepository) {

        this.assessmentRepository =
                assessmentRepository;
    }

    @Override
    public AssessmentResponse createAssessment(
            AssessmentRequest request) {

        MultipartFile file =
                request.getFile();

        // File is compulsory during create
        if (file == null || file.isEmpty()) {

            throw new AssessmentFileRequiredException(
                    "Assessment file is required"
            );
        }

        String name = request.getName().trim();
        String organisation = request.getOrganisation().trim();

        if (assessmentRepository.existsByNormalizedName(name)) {
            throw new AssessmentAlreadyExistsException(
                    "Assessment with this name already exists"
            );
        }

        try {

            LocalDateTime now =
                    LocalDateTime.now();

            Assessment assessment =
                    Assessment.builder()
                            .name(
                                    request.getName().trim()
                            )
                            .organisation(
                                    request.getOrganisation().trim()
                            )
                            .fileName(
                                    file.getOriginalFilename()
                            )
                            .fileType(
                                    file.getContentType()
                            )
                            .fileData(
                                    file.getBytes()
                            )
                            .active(true)
                            .createdAt(now)
                            .updatedAt(now)
                            .build();

            Assessment savedAssessment =
                    assessmentRepository.save(
                            assessment
                    );

            return mapToResponse(
                    savedAssessment
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read assessment file",
                    e
            );
        }
    }

    @Override
    public AssessmentResponse updateAssessment(
            Long id,
            AssessmentRequest request) {

        Assessment assessment =
                assessmentRepository
                        .findByIdAndActiveTrue(id)
                        .orElseThrow(
                                () ->
                                        new AssessmentNotFoundException(
                                                "Assessment not found with id: "
                                                        + id
                                        )
                        );

        MultipartFile file =
                request.getFile();

        // File is compulsory during update
        if (file == null || file.isEmpty()) {

            throw new AssessmentFileRequiredException(
                    "Assessment file is required"
            );
        }

        try {

            assessment.setName(
                    request.getName().trim()
            );

            assessment.setOrganisation(
                    request.getOrganisation().trim()
            );

            // New file is compulsory during update
            // and replaces the existing file
            assessment.setFileName(
                    file.getOriginalFilename()
            );

            assessment.setFileType(
                    file.getContentType()
            );

            assessment.setFileData(
                    file.getBytes()
            );

            assessment.setUpdatedAt(
                    LocalDateTime.now()
            );

            Assessment updatedAssessment =
                    assessmentRepository.save(
                            assessment
                    );

            return mapToResponse(
                    updatedAssessment
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to read assessment file",
                    e
            );
        }
    }

    @Override
    public List<AssessmentResponse> getAllAssessments() {

        return assessmentRepository
                .findByActiveTrueOrderByIdAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deactivateAssessment(Long id) {

        Assessment assessment =
                assessmentRepository
                        .findByIdAndActiveTrue(id)
                        .orElseThrow(
                                () ->
                                        new AssessmentNotFoundException(
                                                "Assessment not found with id: "
                                                        + id
                                        )
                        );

        assessment.setActive(false);
        assessment.setUpdatedAt(LocalDateTime.now());
        assessmentRepository.save(assessment);
    }

    private AssessmentResponse mapToResponse(
            Assessment assessment) {

        return AssessmentResponse.builder()
                .id(
                        assessment.getId()
                )
                .name(
                        assessment.getName()
                )
                .organisation(
                        assessment.getOrganisation()
                )
                .fileName(
                        assessment.getFileName()
                )
                .fileType(
                        assessment.getFileType()
                )
                .active(
                        assessment.getActive()
                )
                .createdAt(
                        assessment.getCreatedAt()
                )
                .updatedAt(
                        assessment.getUpdatedAt()
                )
                .build();
    }


    @Override
    public AssessmentByIdResponse getAssessmentById(
            Long id) {

        Assessment assessment =
                assessmentRepository
                        .findByIdAndActiveTrue(id)
                        .orElseThrow(
                                () ->
                                        new AssessmentNotFoundException(
                                                "Assessment not found with id: "
                                                        + id
                                        )
                        );

        return mapToAssessmentByIdResponse(
                assessment
        );
    }
    private AssessmentByIdResponse mapToAssessmentByIdResponse(
            Assessment assessment) {

        return AssessmentByIdResponse.builder()
                .id(
                        assessment.getId()
                )
                .name(
                        assessment.getName()
                )
                .organisation(
                        assessment.getOrganisation()
                )
                .fileName(
                        assessment.getFileName()
                )
                .fileType(
                        assessment.getFileType()
                )
                .fileData(
                        assessment.getFileData()
                )
                .active(
                        assessment.getActive()
                )
                .createdAt(
                        assessment.getCreatedAt()
                )
                .updatedAt(
                        assessment.getUpdatedAt()
                )
                .build();
    }
}