package medislot_provider_verification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ImportError {

    private int rowNumber;

    private String email;

    private List<String> errors;
}

