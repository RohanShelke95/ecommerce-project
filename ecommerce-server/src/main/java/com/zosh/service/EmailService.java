package com.zosh.service;

import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username:shelkerohan2001@gmail.com}")
    private String senderEmail;

    @Value("${spring.mail.password:}")
    private String senderPassword;

    // HTTP-based API Keys (Bypasses Render's firewall blocking SMTP ports 587/465/25)
    @Value("${brevo.api.key:${BREVO_API_KEY:}}")
    private String brevoApiKey;

    @Value("${resend.api.key:${RESEND_API_KEY:}}")
    private String resendApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Synchronous email dispatch — tries HTTP API (Brevo/Resend) first, then SMTP fallback.
     */
    public String sendEmailSync(String toEmail, String subject, String htmlBody) throws Exception {
        // 1. Try Brevo HTTPS REST API (Works 100% on Render Free Tier via Port 443)
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            return sendViaBrevo(toEmail, subject, htmlBody);
        }

        // 2. Try Resend HTTPS REST API (Works 100% on Render Free Tier via Port 443)
        if (resendApiKey != null && !resendApiKey.isBlank()) {
            return sendViaResend(toEmail, subject, htmlBody);
        }

        // 3. Fallback to JavaMailSender SMTP (Requires open outbound SMTP ports)
        if (senderPassword == null || senderPassword.isBlank() || senderPassword.contains("your-app-password")) {
            throw new IllegalStateException("No Email API configured! On Render free tier, SMTP ports 587/465 are blocked. Please set BREVO_API_KEY or RESEND_API_KEY.");
        }

        System.out.println("[EMAIL] Attempting SMTP dispatch via smtp.gmail.com to: " + toEmail);
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(senderEmail);
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        javaMailSender.send(message);
        System.out.println("[EMAIL SUCCESS] SMTP Mail sent successfully to: " + toEmail);
        return "SMTP Mail sent successfully to: " + toEmail;
    }

    /**
     * Sends email via Brevo (formerly Sendinblue) HTTP API over HTTPS (Port 443).
     * 300 free emails per day forever. Render cannot block this!
     */
    private String sendViaBrevo(String toEmail, String subject, String htmlBody) throws Exception {
        System.out.println("[BREVO API] Sending email via HTTPS REST API to: " + toEmail);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey.trim());
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        Map<String, Object> payload = new HashMap<>();
        Map<String, String> sender = new HashMap<>();
        sender.put("name", "ShopWithUs");
        sender.put("email", senderEmail);
        payload.put("sender", sender);

        Map<String, String> recipient = new HashMap<>();
        recipient.put("email", toEmail.trim());
        payload.put("to", Collections.singletonList(recipient));

        payload.put("subject", subject);
        payload.put("htmlContent", htmlBody);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(
            new URI("https://api.brevo.com/v3/smtp/email"),
            HttpMethod.POST,
            entity,
            String.class
        );

        System.out.println("[BREVO SUCCESS] Response status: " + response.getStatusCode() + " body: " + response.getBody());
        return "Brevo Email sent successfully to " + toEmail;
    }

    /**
     * Sends email via Resend HTTP API over HTTPS (Port 443).
     */
    private String sendViaResend(String toEmail, String subject, String htmlBody) throws Exception {
        System.out.println("[RESEND API] Sending email via HTTPS REST API to: " + toEmail);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + resendApiKey.trim());

        Map<String, Object> payload = new HashMap<>();
        payload.put("from", "ShopWithUs <onboarding@resend.dev>");
        payload.put("to", Collections.singletonList(toEmail.trim()));
        payload.put("subject", subject);
        payload.put("html", htmlBody);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(
            new URI("https://api.resend.com/emails"),
            HttpMethod.POST,
            entity,
            String.class
        );

        System.out.println("[RESEND SUCCESS] Response: " + response.getBody());
        return "Resend Email sent successfully to " + toEmail;
    }

    /**
     * Asynchronous email sending for non-blocking HTTP requests.
     */
    public void sendEmail(String toEmail, String subject, String htmlBody) {
        CompletableFuture.runAsync(() -> {
            try {
                sendEmailSync(toEmail, subject, htmlBody);
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
