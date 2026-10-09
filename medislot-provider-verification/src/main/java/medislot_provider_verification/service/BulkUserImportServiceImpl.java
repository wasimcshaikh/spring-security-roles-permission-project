package medislot_provider_verification.service;

import medislot_provider_verification.dto.BulkImportCompareResponse;
import medislot_provider_verification.dto.BulkImportResponse;
import medislot_provider_verification.dto.BulkUserImportRow;
import medislot_provider_verification.dto.ImportError;
import medislot_provider_verification.entity.Provider;
import medislot_provider_verification.entity.RoleEntity;
import medislot_provider_verification.repository.ProviderRepository;
import medislot_provider_verification.repository.RoleRepository;
import medislot_provider_verification.validator.BulkUserValidator;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BulkUserImportServiceImpl
        implements BulkUserImportService {

    private final ProviderRepository providerRepository;
    private final RoleRepository roleRepository;
    private final BulkUserValidator bulkUserValidator;

    public BulkUserImportServiceImpl(
            ProviderRepository providerRepository,
            RoleRepository roleRepository,
            BulkUserValidator bulkUserValidator) {

        this.providerRepository = providerRepository;
        this.roleRepository = roleRepository;
        this.bulkUserValidator = bulkUserValidator;
    }

    // ============================================================
    // CREATE USERS
    // ============================================================

    @Override
    public BulkImportResponse importUsers(
            MultipartFile file) {

        List<ImportError> errors = new ArrayList<>();

        List<Provider> validProviders = new ArrayList<>();

        Set<String> csvEmails = new HashSet<>();

        int totalRecords = 0;

        try (
                BufferedReader reader =
                        new BufferedReader(
                                new InputStreamReader(
                                        file.getInputStream(),
                                        StandardCharsets.UTF_8
                                )
                        );

                CSVParser csvParser =
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .setTrim(true)
                                .get()
                                .parse(reader)
        ) {

            for (CSVRecord record : csvParser) {

                totalRecords++;

                BulkUserImportRow row =
                        mapRecordToRow(record);

                normalizeRow(row);

                List<String> validationErrors =
                        bulkUserValidator.validate(row);

                String email = row.getEmail();

                /*
                 * Check duplicate email inside CSV
                 */
                if (email != null && !email.isBlank()) {

                    if (!csvEmails.add(email)) {

                        validationErrors.add(
                                "Duplicate email found in CSV"
                        );
                    }
                }

                /*
                 * If validation failed,
                 * don't process this row further.
                 */
                if (!validationErrors.isEmpty()) {

                    errors.add(
                            new ImportError(
                                    (int) record.getRecordNumber() + 1,
                                    email,
                                    validationErrors
                            )
                    );

                    continue;
                }

                /*
                 * Check whether email already exists
                 * in the database.
                 */
                Optional<Provider> existingProvider =
                        providerRepository.findByEmail(email);

                if (existingProvider.isPresent()) {

                    errors.add(
                            new ImportError(
                                    (int) record.getRecordNumber() + 1,
                                    email,
                                    List.of(
                                            "Email already exists"
                                    )
                            )
                    );

                    continue;
                }

                /*
                 * Find the role from database.
                 */
                Optional<RoleEntity> roleOptional =
                        roleRepository.findByName(
                                row.getRole()
                        );

                if (roleOptional.isEmpty()) {

                    errors.add(
                            new ImportError(
                                    (int) record.getRecordNumber() + 1,
                                    email,
                                    List.of(
                                            "Role not found: "
                                                    + row.getRole()
                                    )
                            )
                    );

                    continue;
                }

                RoleEntity role =
                        roleOptional.get();

                LocalDateTime now =
                        LocalDateTime.now();

                Provider provider =
                        Provider.builder()
                                .fullName(
                                        row.getFullName()
                                )
                                .email(
                                        row.getEmail()
                                )
                                .phoneNumber(
                                        row.getPhoneNumber()
                                )
                                .password(
                                        row.getPassword()
                                )
                                .role(role)
                                .verified(true)
                                .createdAt(now)
                                .updatedAt(now)
                                .build();

                validProviders.add(provider);
            }

            /*
             * Save all valid users together.
             */
            if (!validProviders.isEmpty()) {

                providerRepository.saveAll(
                        validProviders
                );
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to process CSV file: "
                            + e.getMessage(),
                    e
            );
        }

        return new BulkImportResponse(
                totalRecords,
                validProviders.size(),
                errors.size(),
                errors
        );
    }


    // ============================================================
    // COMPARE USERS
    // ============================================================

    @Override
    public BulkImportCompareResponse compareUsers(
            MultipartFile file) {

        List<ImportError> errors =
                new ArrayList<>();

        List<BulkUserImportRow> validRows =
                new ArrayList<>();

        Set<String> csvEmails =
                new HashSet<>();

        int totalRecords = 0;

        try (
                BufferedReader reader =
                        new BufferedReader(
                                new InputStreamReader(
                                        file.getInputStream(),
                                        StandardCharsets.UTF_8
                                )
                        );

                CSVParser csvParser =
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .setTrim(true)
                                .get()
                                .parse(reader)
        ) {

            /*
             * Step 1:
             * Read CSV row by row.
             */
            for (CSVRecord record : csvParser) {

                totalRecords++;

                /*
                 * Step 2:
                 * Convert CSV record into DTO.
                 */
                BulkUserImportRow row =
                        mapRecordToRow(record);

                /*
                 * Step 3:
                 * Normalize CSV values.
                 */
                normalizeRow(row);

                /*
                 * Step 4:
                 * Validate the row.
                 */
                List<String> validationErrors =
                        bulkUserValidator.validate(row);

                String email =
                        row.getEmail();

                /*
                 * Step 5:
                 * Check duplicate email inside CSV.
                 */
                if (email != null && !email.isBlank()) {

                    if (!csvEmails.add(email)) {

                        validationErrors.add(
                                "Duplicate email found in CSV"
                        );
                    }
                }

                /*
                 * Step 6:
                 * If validation failed,
                 * add it to errors and skip it.
                 */
                if (!validationErrors.isEmpty()) {

                    errors.add(
                            new ImportError(
                                    (int) record.getRecordNumber() + 1,
                                    email,
                                    validationErrors
                            )
                    );

                    continue;
                }

                /*
                 * Step 7:
                 * Keep valid rows for DB comparison.
                 */
                validRows.add(row);
            }


            /*
             * Step 8:
             * Extract emails from valid CSV rows.
             */
            List<String> emails =
                    validRows.stream()
                            .map(
                                    BulkUserImportRow::getEmail
                            )
                            .toList();


            /*
             * Step 9:
             * Find existing users in DB.
             *
             * IMPORTANT:
             * This only READS from DB.
             *
             * There is NO saveAll() here.
             */
            List<Provider> existingProviders =
                    emails.isEmpty()
                            ? List.of()
                            : providerRepository
                            .findByEmailIn(emails);


            /*
             * Step 10:
             * Convert existing DB emails
             * into a Set.
             */
            Set<String> existingEmails =
                    existingProviders.stream()
                            .map(
                                    Provider::getEmail
                            )
                            .map(String::toLowerCase)
                            .collect(Collectors.toSet());


            /*
             * Step 11:
             * Compare CSV emails with DB emails.
             */
            int matchingRecords = 0;

            int readyToCreateRecords = 0;

            for (BulkUserImportRow row : validRows) {

                String email =
                        row.getEmail();

                if (existingEmails.contains(email)) {

                    matchingRecords++;

                } else {

                    readyToCreateRecords++;
                }
            }


            /*
             * Step 12:
             * Return comparison result.
             */
            return new BulkImportCompareResponse(
                    totalRecords,
                    matchingRecords,
                    readyToCreateRecords,
                    errors.size(),
                    errors
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to compare CSV file: "
                            + e.getMessage(),
                    e
            );
        }
    }


    // ============================================================
    // MAP CSV RECORD TO DTO
    // ============================================================

    private BulkUserImportRow mapRecordToRow(
            CSVRecord record) {

        BulkUserImportRow row =
                new BulkUserImportRow();

        row.setFullName(
                record.get("fullName")
        );

        row.setEmail(
                record.get("email")
        );

        row.setPhoneNumber(
                record.get("phoneNumber")
        );

        row.setPassword(
                record.get("password")
        );

        row.setRole(
                record.get("role")
        );

        return row;
    }


    // ============================================================
    // NORMALIZE CSV DATA
    // ============================================================

    private void normalizeRow(
            BulkUserImportRow row) {

        if (row.getFullName() != null) {

            row.setFullName(
                    row.getFullName().trim()
            );
        }

        if (row.getEmail() != null) {

            row.setEmail(
                    row.getEmail()
                            .trim()
                            .toLowerCase()
            );
        }

        if (row.getPhoneNumber() != null) {

            row.setPhoneNumber(
                    row.getPhoneNumber().trim()
            );
        }

        if (row.getPassword() != null) {

            row.setPassword(
                    row.getPassword().trim()
            );
        }

        if (row.getRole() != null) {

            row.setRole(
                    row.getRole()
                            .trim()
                            .toUpperCase()
            );
        }
    }
}