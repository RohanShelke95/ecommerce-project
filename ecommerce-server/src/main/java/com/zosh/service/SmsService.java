package com.zosh.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class SmsService {

    @Value("${sms.provider:mock}")
    private String provider; // "mock", "fast2sms", or "twilio"

    @Value("${fast2sms.api.key:}")
    private String fast2smsApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends an SMS OTP to the given phone number.
     */
    public boolean sendSmsOtp(String phoneNumber, String otp) {
        String cleanPhone = phoneNumber.replaceAll("[^0-9+]", "");
        System.out.println("[SMS SERVICE] Preparing SMS OTP for mobile: " + cleanPhone);

        if ("fast2sms".equalsIgnoreCase(provider) && fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            return sendViaFast2SMS(cleanPhone, otp);
        }

        // Default: Mock SMS provider (logs OTP to server console, ideal for testing & development)
        System.out.println("=================================================");
        System.out.println("📱 [SMS OTP DISPATCH - MOCK PROVIDER]");
        System.out.println("📱 TO: " + cleanPhone);
        System.out.println("📱 MESSAGE: Your ShopWithUs OTP code is: " + otp + ". Valid for 10 minutes.");
        System.out.println("=================================================");
        return true;
    }

    private boolean sendViaFast2SMS(String phoneNumber, String otp) {
        try {
            // Fast2SMS Quick Transactional API format
            String numbers = phoneNumber.startsWith("+91") ? phoneNumber.substring(3) : phoneNumber;
            String message = "Your ShopWithUs OTP verification code is: " + otp;
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);

            String url = "https://www.fast2sms.com/dev/bulkV2?authorization=" + fast2smsApiKey +
                    "&route=q&message=" + encodedMessage + "&language=english&flash=0&numbers=" + numbers;

            String response = restTemplate.getForObject(new URI(url), String.class);
            System.out.println("[FAST2SMS RESPONSE]: " + response);
            return true;
        } catch (Exception e) {
            System.err.println("[SMS ERROR] Failed to send SMS via Fast2SMS: " + e.getMessage());
            return false;
        }
    }
}
