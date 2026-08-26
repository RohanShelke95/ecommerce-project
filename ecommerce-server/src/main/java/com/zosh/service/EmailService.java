package com.zosh.service;

import java.util.concurrent.CompletableFuture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
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
        // Skip email attempt if password is empty or default placeholder to prevent connection hangs
        if (senderPassword == null || senderPassword.isBlank() || senderPassword.contains("your-app-password")) {
            System.out.println("[EMAIL] Skipping email send to " + toEmail + " (SMTP password not configured)");
            return;
        }

        // Send email asynchronously so HTTP request thread returns immediately
        CompletableFuture.runAsync(() -> {
            try {
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(senderEmail);
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlBody, true); // true indicates HTML

                javaMailSender.send(message);
                System.out.println("Mail sent successfully to " + toEmail);
            } catch (Exception e) {
                System.err.println("Error sending email to " + toEmail + ": " + e.getMessage());
            }
        });
    }
}
