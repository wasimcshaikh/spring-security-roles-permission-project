package medislot_provider_verification.service;

public interface EmailService {

    void sendOtpEmail(String email, String otp);
}