package medislot_provider_verification.service;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.ProviderDocumentAdminResponse;
import medislot_provider_verification.dto.ProviderDocumentResponse;
import medislot_provider_verification.entity.Provider;
import medislot_provider_verification.entity.ProviderDocument;
import medislot_provider_verification.entity.Role;
import medislot_provider_verification.exception.InvalidAccessException;
import medislot_provider_verification.exception.InvalidDocumentException;
import medislot_provider_verification.repository.ProviderDocumentRepository;
import medislot_provider_verification.repository.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderDocumentServiceImpl
        implements ProviderDocumentService {

    private static final long MAX_FILE_SIZE =
            5 * 1024 * 1024;

    private final ProviderDocumentRepository
            providerDocumentRepository;

    private final ProviderRepository providerRepository;

    @Override
    public void uploadDocument(
            Long providerId,
            MultipartFile file) {

        // 1. Validate file
        validateFile(file);

        // 2. Find provider
        Provider provider =
                providerRepository
                        .findById(providerId)
                        .orElseThrow(() ->
                                new InvalidDocumentException(
                                        "Provider not found"
                                )
                        );

        if(provider.getRole() == Role.ADMIN)
        {
            throw new InvalidAccessException(
                    "Cannot upload document for admin"
            );
        }

        try {

            // 3. Create ProviderDocument
            ProviderDocument document =
                    ProviderDocument.builder()
                            .provider(provider)
                            .fileName(
                                    file.getOriginalFilename()
                            )
                            .fileData(
                                    file.getBytes()
                            )
                            .contentType("application/pdf")

                            .fileSize(
                                    file.getSize()
                            )
                            .uploadedAt(
                                    LocalDateTime.now()
                            )
                            .build();

            // 4. Save document
            providerDocumentRepository.save(document);

        } catch (IOException exception) {

            throw new InvalidDocumentException(
                    "Unable to read uploaded file"
            );
        }
    }

    private void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new InvalidDocumentException(
                    "File is required"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {

            throw new InvalidDocumentException(
                    "File size cannot exceed 5 MB"
            );
        }

        String fileName =
                file.getOriginalFilename();

        if (fileName == null ||
                !fileName
                        .toLowerCase()
                        .endsWith(".pdf")) {

            throw new InvalidDocumentException(
                    "Only PDF files are allowed"
            );
        }
    }

    @Override
    public ProviderDocument getDocument(
            Long providerId,
            Long documentId) {

        return providerDocumentRepository
                .findByIdAndProviderId(
                        documentId,
                        providerId
                )
                .orElseThrow(() ->
                        new InvalidDocumentException(
                                "Document not found"
                        )
                );
    }


    @Override
    public List<ProviderDocumentResponse> getProviderDocuments(
            Long providerId) {

        /*
         * Verify provider exists
         */

        providerRepository
                .findById(providerId)
                .orElseThrow(() ->
                        new InvalidDocumentException(
                                "Provider not found"
                        )
                );


        /*
         * Fetch documents belonging
         * to this provider
         */

        List<ProviderDocument> documents =
                providerDocumentRepository
                        .findByProviderId(providerId);


        /*
         * Convert entity to response DTO
         */

        return documents
                .stream()
                .map(document ->
                        ProviderDocumentResponse
                                .builder()
                                .id(document.getId())
                                .fileName(
                                        document.getFileName()
                                )
                                .fileSize(
                                        formatFileSize(
                                                document.getFileSize()
                                        )
                                )
                                .uploadedAt(
                                        document.getUploadedAt()
                                )
                                .build()
                )
                .toList();
    }

    private String formatFileSize(Long fileSizeInBytes) {

        double oneMb =
                1024.0 * 1024.0;

        if (fileSizeInBytes < oneMb) {

            double fileSizeInKb =
                    fileSizeInBytes / 1024.0;

            return String.format(
                    "%.2f KB",
                    fileSizeInKb
            );
        }

        double fileSizeInMb =
                fileSizeInBytes / oneMb;

        return String.format(
                "%.2f MB",
                fileSizeInMb
        );
    }

    @Override
    public void deleteDocument(
            Long providerId,
            Long documentId) {

        /*
         * Find the document using BOTH
         * document ID and provider ID.
         *
         * This ensures that a provider
         * can delete only their own document.
         */

        ProviderDocument document =
                providerDocumentRepository
                        .findByIdAndProviderId(
                                documentId,
                                providerId
                        )
                        .orElseThrow(() ->
                                new InvalidDocumentException(
                                        "Document not found"
                                )
                        );


        /*
         * Delete the document.
         *
         * This removes the database row,
         * including the BYTEA PDF data.
         */

        providerDocumentRepository.delete(
                document
        );
    }

    @Override
    public List<ProviderDocumentAdminResponse> getAllProviderDocuments() {

        List<ProviderDocument> documents =
                providerDocumentRepository.findAll();

        return documents.stream()
                .map(document ->
                        ProviderDocumentAdminResponse.builder()
                                .documentId(document.getId())
                                .providerId(document.getProvider().getId())
                                .providerName(document.getProvider().getFullName())
                                .fileName(document.getFileName())
                                .fileSize(
                                        formatFileSize(
                                                document.getFileSize()
                                        )
                                )
                                .uploadedAt(document.getUploadedAt())
                                .build()
                )
                .toList();
    }
}