package com.zosh.service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private static final long OTP_VALIDITY_DURATION_MS = 10 * 60 * 1000; // 10 minutes
    private final Map<String, OtpDetails> otpCache = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public static class OtpDetails {
        private final String code;
        private final long expiryTime;

        public OtpDetails(String code, long expiryTime) {
            this.code = code;
            this.expiryTime = expiryTime;
        }

        public String getCode() {
            return code;
        }

        public boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }
    }

    /**
     * Generates a 6-digit random OTP code for the given email.
     */
    public String generateOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();
        int number = 100000 + random.nextInt(900000);
        String code = String.valueOf(number);
        long expiryTime = System.currentTimeMillis() + OTP_VALIDITY_DURATION_MS;

        otpCache.put(cleanEmail, new OtpDetails(code, expiryTime));
        System.out.println("[OTP GENERATED] Code for " + cleanEmail + ": " + code);
        return code;
    }

    /**
     * Validates the provided OTP for the email.
     */
    public boolean validateOtp(String email, String inputOtp) {
        if (email == null || inputOtp == null) return false;
        String cleanEmail = email.trim().toLowerCase();
        String cleanInput = inputOtp.trim();

        OtpDetails details = otpCache.get(cleanEmail);
        if (details == null) {
            System.out.println("[OTP ERROR] No OTP found for " + cleanEmail);
            return false;
        }

        if (details.isExpired()) {
            System.out.println("[OTP ERROR] OTP expired for " + cleanEmail);
            otpCache.remove(cleanEmail);
            return false;
        }

        boolean isValid = details.getCode().equalsIgnoreCase(cleanInput);
        if (isValid) {
            otpCache.remove(cleanEmail); // Clear OTP after successful verification
            System.out.println("[OTP SUCCESS] OTP verified for " + cleanEmail);
        } else {
            System.out.println("[OTP ERROR] Invalid OTP entered for " + cleanEmail);
        }
        return isValid;
    }

    /**
     * Removes cached OTP for an email.
     */
    public void clearOtp(String email) {
        if (email != null) {
            otpCache.remove(email.trim().toLowerCase());
        }
    }
}
