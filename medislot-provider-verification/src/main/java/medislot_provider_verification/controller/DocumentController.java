package medislot_provider_verification.controller;

import medislot_provider_verification.service.PdfTextExtractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final PdfTextExtractionService pdfTextExtractionService;

    public DocumentController(
            PdfTextExtractionService pdfTextExtractionService) {

        this.pdfTextExtractionService = pdfTextExtractionService;
    }

    @PostMapping("/extract-text")
    public ResponseEntity<String> extractText(
            @RequestParam("file") MultipartFile file) {


        if (file == null || file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Please upload a PDF file");
        }

        try {

            String extractedText =
                    pdfTextExtractionService.extractText(file);

            return ResponseEntity.ok(extractedText);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Failed to extract PDF text: " + e.getMessage());
        }
    }
}