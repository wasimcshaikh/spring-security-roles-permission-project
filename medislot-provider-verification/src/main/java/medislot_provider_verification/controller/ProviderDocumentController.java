package medislot_provider_verification.controller;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.dto.ProviderDocumentAdminResponse;
import medislot_provider_verification.dto.ProviderDocumentResponse;
import medislot_provider_verification.entity.ProviderDocument;
import medislot_provider_verification.service.ProviderDocumentService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/providers/documents")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProviderDocumentController {

    private final ProviderDocumentService
            providerDocumentService;


    /*
     * Upload document
     */

    @PostMapping
    public ResponseEntity<String> uploadDocument(
            @RequestParam("providerId") Long providerId,
            @RequestParam("file") MultipartFile file) {

        providerDocumentService.uploadDocument(
                providerId,
                file
        );

        return ResponseEntity.ok(
                "Document uploaded successfully"
        );
    }


    /*
     * Get single document
     */

    @GetMapping("/{documentId}")
    public ResponseEntity<byte[]> getDocument(
            @RequestParam("providerId") Long providerId,
            @PathVariable Long documentId) {

        ProviderDocument document =
                providerDocumentService.getDocument(
                        providerId,
                        documentId
                );

        return ResponseEntity.ok()
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                document.getFileName() +
                                "\""
                )
                .body(
                        document.getFileData()
                );
    }


    /*
     * Get all documents of provider
     */

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderDocumentResponse>>
    getProviderDocuments(
            @PathVariable Long providerId) {

        List<ProviderDocumentResponse> documents =
                providerDocumentService
                        .getProviderDocuments(
                                providerId
                        );

        return ResponseEntity.ok(documents);
    }


    @DeleteMapping("/{documentId}")
    public ResponseEntity<String> deleteDocument(
            @RequestParam("providerId") Long providerId,
            @PathVariable Long documentId) {

        providerDocumentService.deleteDocument(
                providerId,
                documentId
        );

        return ResponseEntity.ok(
                "Document deleted successfully"
        );
    }

    @GetMapping
    public ResponseEntity<List<ProviderDocumentAdminResponse>>
    getAllProviderDocuments() {

        List<ProviderDocumentAdminResponse> documents =
                providerDocumentService
                        .getAllProviderDocuments();

        return ResponseEntity.ok(documents);
    }
}

