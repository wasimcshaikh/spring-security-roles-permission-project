package medislot_provider_verification.service;

import lombok.RequiredArgsConstructor;
import medislot_provider_verification.entity.Provider;
import medislot_provider_verification.repository.ProviderRepository;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;


import org.openpdf.text.Document;
import org.openpdf.text.Element;
import org.openpdf.text.Font;
import org.openpdf.text.Paragraph;
import org.openpdf.text.pdf.PdfPTable;
import org.openpdf.text.pdf.PdfWriter;


import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl
        implements ExportService {

    private final ProviderRepository providerRepository;

    @Override
    public byte[] exportProvidersToCsv() {

        List<Provider> providers =
                providerRepository.findAll();

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream();

                PrintWriter writer =
                        new PrintWriter(
                                new OutputStreamWriter(
                                        outputStream,
                                        StandardCharsets.UTF_8
                                )
                        );

                CSVPrinter csvPrinter =
                        new CSVPrinter(
                                writer,
                                CSVFormat.DEFAULT.builder()
                                        .setHeader(
                                                "ID",
                                                "Full Name",
                                                "Email",
                                                "Phone Number",
                                                "Verified",
                                                "Created At"
                                        )
                                        .get()
                        )
        ) {

            for (Provider provider : providers) {

                csvPrinter.printRecord(
                        provider.getId(),
                        provider.getFullName(),
                        provider.getEmail(),
                        provider.getPhoneNumber(),
                        provider.getVerified(),
                        provider.getCreatedAt()
                );
            }

            csvPrinter.flush();

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to generate CSV file",
                    exception
            );
        }
    }


    @Override
    public byte[] exportProvidersToPdf() {

        List<Provider> providers =
                providerRepository.findAll();

        try (
                ByteArrayOutputStream outputStream =
                        new ByteArrayOutputStream()
        ) {

            Document document =
                    new Document();

            PdfWriter.getInstance(
                    document,
                    outputStream
            );

            document.open();

            Font titleFont =
                    new Font(
                            Font.HELVETICA,
                            20,
                            Font.BOLD
                    );

            Paragraph title =
                    new Paragraph(
                            "MediSlot Provider Report",
                            titleFont
                    );

            title.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(title);

            document.add(
                    new Paragraph(" ")
            );

            PdfPTable table =
                    new PdfPTable(6);

            table.addCell("ID");
            table.addCell("Full Name");
            table.addCell("Email");
            table.addCell("Phone Number");
            table.addCell("Verified");
            table.addCell("Created At");

            for (Provider provider : providers) {

                table.addCell(
                        String.valueOf(
                                provider.getId()
                        )
                );

                table.addCell(
                        provider.getFullName()
                );

                table.addCell(
                        provider.getEmail()
                );

                table.addCell(
                        provider.getPhoneNumber()
                );

                table.addCell(
                        String.valueOf(
                                provider.getVerified()
                        )
                );

                table.addCell(
                        provider.getCreatedAt()
                                .toString()
                );
            }

            document.add(table);

            document.close();

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Unable to generate PDF file",
                    exception
            );
        }
    }
}