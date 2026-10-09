package medislot_provider_verification.service;

import medislot_provider_verification.dto.BulkImportCompareResponse;
import medislot_provider_verification.dto.BulkImportResponse;
import org.springframework.web.multipart.MultipartFile;

public interface BulkUserImportService {

    BulkImportResponse importUsers(MultipartFile file);

    BulkImportCompareResponse compareUsers(MultipartFile file);

}