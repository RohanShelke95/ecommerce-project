package com.zosh.service;

import java.util.concurrent.CompletableFuture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${spring.mail.password:}")
    private String senderPassword;

    public void sendEmail(String toEmail, String subject, String htmlBody) {
        // Skip email attempt if password is empty or still the default placeholder
        if (senderPassword == null || senderPassword.isBlank() || senderPassword.contains("your-app-password")) {
            System.err.println("=================================================================");
            System.err.println("[EMAIL SKIPPED] Cannot send real email to: " + toEmail);
            System.err.println("[REASON] SPRING_MAIL_PASSWORD is not set or still the default placeholder.");
            System.err.println("[ACTION] Set SPRING_MAIL_PASSWORD env var in your hosting dashboard");
            System.err.println("         with your 16-letter Gmail App Password (NO spaces!).");
            System.err.println("=================================================================");
            return;
        }

        // Send email asynchronously to avoid blocking the HTTP response
        CompletableFuture.runAsync(() -> {
            try {
                System.out.println("[EMAIL] Attempting to send email to: " + toEmail);
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(senderEmail);
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlBody, true); // true = HTML body

                javaMailSender.send(message);
                System.out.println("[EMAIL SUCCESS] Mail sent successfully to: " + toEmail);
            } catch (Exception e) {
                System.err.println("[EMAIL ERROR] Failed to send email to: " + toEmail);
                System.err.println("[EMAIL ERROR] Cause: " + e.getClass().getSimpleName() + " - " + e.getMessage());
                if (e.getCause() != null) {
                    System.err.println("[EMAIL ERROR] Root Cause: " + e.getCause().getMessage());
                }
            }
        });
    }
}
