package medislot_provider_verification.controller;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.service.ExportService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/export")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportProvidersToCsv() {

        byte[] csv =
                exportService.exportProvidersToCsv();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"providers.csv\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                "text/csv"
                        )
                )
                .body(csv);
    }


    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportProvidersToPdf() {

        byte[] pdf =
                exportService.exportProvidersToPdf();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"providers.pdf\""
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(pdf);
    }
}