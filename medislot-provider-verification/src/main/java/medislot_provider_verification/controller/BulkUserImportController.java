package medislot_provider_verification.controller;

import medislot_provider_verification.dto.BulkImportCompareResponse;
import medislot_provider_verification.dto.BulkImportResponse;
import medislot_provider_verification.service.BulkUserImportService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/users/import")
public class BulkUserImportController {

    private final BulkUserImportService bulkUserImportService;

    public BulkUserImportController(
            BulkUserImportService bulkUserImportService) {

        this.bulkUserImportService = bulkUserImportService;
    }

    @PostMapping(
            value = "/create",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<BulkImportResponse> importUsers(
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        if (!isCsvFile(file)) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        BulkImportResponse response =
                bulkUserImportService.importUsers(file);

        return ResponseEntity.ok(response);
    }

    @PostMapping(
            value = "/compare",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<BulkImportCompareResponse> compareUsers(
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        if (!isCsvFile(file)) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }

        BulkImportCompareResponse response =
                bulkUserImportService.compareUsers(file);

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // CSV VALIDATION
    // ============================================================



    private boolean isCsvFile(MultipartFile file) {

        String filename =
                file.getOriginalFilename();

        return filename != null
                && filename
                .toLowerCase()
                .endsWith(".csv");
    }
}