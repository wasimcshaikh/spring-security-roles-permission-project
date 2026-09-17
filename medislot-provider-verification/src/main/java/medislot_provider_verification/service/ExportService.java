package medislot_provider_verification.service;

public interface ExportService {

    byte[] exportProvidersToCsv();

    byte[] exportProvidersToPdf();
}