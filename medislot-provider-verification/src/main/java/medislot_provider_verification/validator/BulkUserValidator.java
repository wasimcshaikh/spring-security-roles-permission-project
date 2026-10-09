package medislot_provider_verification.validator;

import medislot_provider_verification.dto.BulkUserImportRow;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class BulkUserValidator {

    private static final int MAX_FULL_NAME_LENGTH = 100;
    private static final int MAX_PHONE_LENGTH = 20;
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int MAX_PASSWORD_LENGTH = 100;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile(
                    "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
            );

    public List<String> validate(BulkUserImportRow row) {

        List<String> errors = new ArrayList<>();

        validateFullName(row.getFullName(), errors);
        validateEmail(row.getEmail(), errors);
        validatePhoneNumber(row.getPhoneNumber(), errors);
        validatePassword(row.getPassword(), errors);
        validateRole(row.getRole(), errors);

        return errors;
    }

    private void validateFullName(
            String fullName,
            List<String> errors
    ) {

        if (fullName == null || fullName.trim().isEmpty()) {
            errors.add("Full name is required");
            return;
        }

        if (fullName.trim().length() > MAX_FULL_NAME_LENGTH) {
            errors.add(
                    "Full name cannot exceed "
                            + MAX_FULL_NAME_LENGTH
                            + " characters"
            );
        }
    }

    private void validateEmail(
            String email,
            List<String> errors
    ) {

        if (email == null || email.trim().isEmpty()) {
            errors.add("Email is required");
            return;
        }

        String normalizedEmail = email.trim();

        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            errors.add("Invalid email format");
        }
    }

    private void validatePhoneNumber(
            String phoneNumber,
            List<String> errors
    ) {

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return;
        }

        if (phoneNumber.trim().length() > MAX_PHONE_LENGTH) {
            errors.add(
                    "Phone number cannot exceed "
                            + MAX_PHONE_LENGTH
                            + " characters"
            );
        }
    }

    private void validatePassword(
            String password,
            List<String> errors
    ) {

        if (password == null || password.trim().isEmpty()) {
            errors.add("Password is required");
            return;
        }

        int passwordLength = password.trim().length();

        if (passwordLength < MIN_PASSWORD_LENGTH
                || passwordLength > MAX_PASSWORD_LENGTH) {

            errors.add(
                    "Password must be between "
                            + MIN_PASSWORD_LENGTH
                            + " and "
                            + MAX_PASSWORD_LENGTH
                            + " characters"
            );
        }
    }

    private void validateRole(
            String role,
            List<String> errors
    ) {

        if (role == null || role.trim().isEmpty()) {
            errors.add("Role is required");
            return;
        }

        String normalizedRole = role.trim().toUpperCase();

        if (!normalizedRole.equals("PROVIDER")
                && !normalizedRole.equals("CLIENT")) {

            errors.add(
                    "Invalid role. Only PROVIDER and CLIENT are allowed"
            );
        }
    }
}