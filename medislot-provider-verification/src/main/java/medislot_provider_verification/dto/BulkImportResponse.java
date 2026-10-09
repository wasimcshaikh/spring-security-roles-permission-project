package medislot_provider_verification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class BulkImportResponse {

    private int totalRecords;

    private int successfulRecords;

    private int failedRecords;

    private List<ImportError> errors;
}