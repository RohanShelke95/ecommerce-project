package com.zosh.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class SmsService {

    @Value("${sms.provider:mock}")
    private String provider; // "mock" or "fast2sms"

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

        // Default: Mock SMS provider — logs OTP to server console
        System.out.println("=================================================");
        System.out.println("📱 [SMS OTP DISPATCH - MOCK PROVIDER]");
        System.out.println("📱 TO: " + cleanPhone);
        System.out.println("📱 OTP CODE: " + otp);
        System.out.println("=================================================");
        return true;
    }

    public String sendViaFast2SMSWithDetails(String phoneNumber, String otp) {
        try {
            // Strip country code: Fast2SMS requires 10-digit Indian mobile number
            String numbers = phoneNumber;
            if (numbers.startsWith("+91")) numbers = numbers.substring(3);
            else if (numbers.startsWith("91") && numbers.length() == 12) numbers = numbers.substring(2);

            System.out.println("[FAST2SMS] Dispatching OTP via Fast2SMS OTP route to: " + numbers);

            // Fast2SMS Official OTP route:
            // https://www.fast2sms.com/dev/bulkV2?authorization=KEY&variables_values=OTP&route=otp&numbers=NUMBERS
            String cleanKey = fast2smsApiKey.trim();
            String cleanOtp = otp.trim();

            String url = "https://www.fast2sms.com/dev/bulkV2"
                + "?authorization=" + URLEncoder.encode(cleanKey, StandardCharsets.UTF_8)
                + "&route=otp"
                + "&variables_values=" + URLEncoder.encode(cleanOtp, StandardCharsets.UTF_8)
                + "&flash=0"
                + "&numbers=" + numbers;

            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", cleanKey);
            headers.set("cache-control", "no-cache");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                new URI(url),
                HttpMethod.GET,
                entity,
                String.class
            );

            String body = response.getBody();
            System.out.println("[FAST2SMS RESPONSE] Status: " + response.getStatusCode() + " | Body: " + body);

            return body != null ? body : "Empty response from Fast2SMS";
        } catch (Exception e) {
            String err = "[SMS ERROR] Fast2SMS dispatch failed: " + e.getClass().getSimpleName() + " - " + e.getMessage();
            System.err.println(err);
            return err;
        }
    }

    private boolean sendViaFast2SMS(String phoneNumber, String otp) {
        String result = sendViaFast2SMSWithDetails(phoneNumber, otp);
        return result != null && result.contains("\"return\":true");
    }
}
