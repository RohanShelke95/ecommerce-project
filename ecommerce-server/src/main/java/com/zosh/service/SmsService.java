package com.zosh.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class SmsService {

    @Value("${sms.provider:mock}")
    private String provider; // "twilio", "fast2sms", or "mock"

    @Value("${fast2sms.api.key:}")
    private String fast2smsApiKey;

    // Twilio credentials
    @Value("${twilio.account.sid:${TWILIO_ACCOUNT_SID:}}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token:${TWILIO_AUTH_TOKEN:}}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number:${TWILIO_PHONE_NUMBER:}}")
    private String twilioPhoneNumber;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends an SMS OTP to the given phone number using Twilio or Fast2SMS.
     */
    public boolean sendSmsOtp(String phoneNumber, String otp) {
        String cleanPhone = phoneNumber.replaceAll("[^0-9+]", "");
        System.out.println("[SMS SERVICE] Preparing SMS OTP for mobile: " + cleanPhone);

        // 1. Try Twilio if configured
        if ("twilio".equalsIgnoreCase(provider) || (twilioAccountSid != null && !twilioAccountSid.isBlank())) {
            String result = sendViaTwilioWithDetails(cleanPhone, otp);
            return result != null && !result.startsWith("[TWILIO ERROR]");
        }

        // 2. Try Fast2SMS if configured
        if ("fast2sms".equalsIgnoreCase(provider) && fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            return sendViaFast2SMS(cleanPhone, otp);
        }

        // 3. Default: Mock SMS provider — logs OTP to server console
        System.out.println("=================================================");
        System.out.println("📱 [SMS OTP DISPATCH - MOCK PROVIDER]");
        System.out.println("📱 TO: " + cleanPhone);
        System.out.println("📱 OTP CODE: " + otp);
        System.out.println("=================================================");
        return true;
    }

    /**
     * Dispatches real SMS using Twilio REST API via standard HTTP POST over port 443.
     */
    public String sendViaTwilioWithDetails(String phoneNumber, String otp) {
        try {
            String clean = phoneNumber.replaceAll("[^0-9]", "");
            String toMobile = clean.startsWith("91") && clean.length() == 12 
                ? "+" + clean 
                : "+91" + clean.substring(Math.max(0, clean.length() - 10));

            System.out.println("[TWILIO] Dispatching OTP to " + toMobile + " from " + twilioPhoneNumber);

            String url = "https://api.twilio.com/2010-04-01/Accounts/" + twilioAccountSid.trim() + "/Messages.json";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(twilioAccountSid.trim(), twilioAuthToken.trim());

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("To", toMobile);
            map.add("From", twilioPhoneNumber.trim());
            map.add("Body", "Your ShopWithUs verification code is: " + otp + ". Valid for 10 minutes.");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            String body = response.getBody();
            System.out.println("[TWILIO SUCCESS] Status: " + response.getStatusCode() + " | Body: " + body);
            return body != null ? body : "Twilio SMS dispatched successfully.";
        } catch (Exception e) {
            String err = "[TWILIO ERROR] Dispatch failed: " + e.getClass().getSimpleName() + " - " + e.getMessage();
            System.err.println(err);
            return err;
        }
    }

    public String sendViaFast2SMSWithDetails(String phoneNumber, String otp) {
        try {
            String numbers = phoneNumber;
            if (numbers.startsWith("+91")) numbers = numbers.substring(3);
            else if (numbers.startsWith("91") && numbers.length() == 12) numbers = numbers.substring(2);

            System.out.println("[FAST2SMS] Dispatching OTP via Fast2SMS OTP route to: " + numbers);

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
