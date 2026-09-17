package medislot_provider_verification.service;

import medislot_provider_verification.dto.ProviderDocumentAdminResponse;
import medislot_provider_verification.dto.ProviderDocumentResponse;
import medislot_provider_verification.entity.ProviderDocument;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProviderDocumentService {

    void uploadDocument(
            Long providerId,
            MultipartFile file
    );

    ProviderDocument getDocument(
            Long providerId,
            Long documentId
    );

    public List<ProviderDocumentResponse> getProviderDocuments(
            Long providerId);


    void deleteDocument(
            Long providerId,
            Long documentId
    );

    public List<ProviderDocumentAdminResponse> getAllProviderDocuments();
}