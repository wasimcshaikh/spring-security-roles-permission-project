package medislot_provider_verification.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface PdfTextExtractionService {

    String extractText(MultipartFile file) throws IOException;
}