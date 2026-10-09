package medislot_provider_verification.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkUserImportRow {

    private String fullName;

    private String email;

    private String phoneNumber;

    private String password;

    private String role;
}