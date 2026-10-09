package medislot_provider_verification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class BulkImportCompareResponse {

    private int totalRecords;
    private int matchingRecords;
    private int readyToCreateRecords;
    private int failedRecords;

    private List<ImportError> errors;
}