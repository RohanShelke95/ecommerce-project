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

        // Default: Mock SMS provider — logs OTP to server console only
        System.out.println("=================================================");
        System.out.println("📱 [SMS OTP DISPATCH - MOCK PROVIDER]");
        System.out.println("📱 TO: " + cleanPhone);
        System.out.println("📱 OTP CODE: " + otp);
        System.out.println("=================================================");
        return true;
    }

    private boolean sendViaFast2SMS(String phoneNumber, String otp) {
        try {
            // Strip country code — Fast2SMS needs a 10-digit Indian mobile number only
            String numbers = phoneNumber;
            if (numbers.startsWith("+91")) numbers = numbers.substring(3);
            else if (numbers.startsWith("91") && numbers.length() == 12) numbers = numbers.substring(2);

            System.out.println("[FAST2SMS] Attempting OTP delivery to: " + numbers);

            String encodedMessage = URLEncoder.encode(
                "Your ShopWithUs OTP is: " + otp + ". Valid 10 mins. Do NOT share this code.",
                StandardCharsets.UTF_8
            );

            // Fast2SMS Quick route (route=q) — no DLT registration needed
            // NOTE: API key is sent as an HTTP header "authorization", NOT in the URL query string.
            // Putting it in the URL query string would break it if the key contains slashes or special chars.
            String url = "https://www.fast2sms.com/dev/bulkV2"
                + "?route=q"
                + "&message=" + encodedMessage
                + "&language=english"
                + "&flash=0"
                + "&numbers=" + numbers;

            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", fast2smsApiKey);
            headers.set("cache-control", "no-cache");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                new URI(url),
                HttpMethod.GET,
                entity,
                String.class
            );

            String body = response.getBody();
            System.out.println("[FAST2SMS RESPONSE] HTTP Status: " + response.getStatusCode());
            System.out.println("[FAST2SMS RESPONSE] Body: " + body);

            if (body != null && body.contains("\"return\":true")) {
                System.out.println("[FAST2SMS SUCCESS] OTP SMS dispatched successfully to: " + numbers);
                return true;
            } else {
                System.err.println("[FAST2SMS FAILED] Check your API key and Fast2SMS account balance/credits.");
                return false;
            }

        } catch (Exception e) {
            System.err.println("[SMS ERROR] Fast2SMS call failed: " + e.getClass().getSimpleName() + " — " + e.getMessage());
            return false;
        }
    }
}
