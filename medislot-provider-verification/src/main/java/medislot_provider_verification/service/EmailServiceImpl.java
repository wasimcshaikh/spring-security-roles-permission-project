package medislot_provider_verification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Override
    public void sendOtpEmail(String email, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("MediSlot Provider Email Verification");
        message.setText(
                "Your MediSlot verification OTP is: " + otp
                        + "\n\nThis OTP is valid for 5 minutes."
        );

        javaMailSender.send(message);
    }
}