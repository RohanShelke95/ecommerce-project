package com.zosh.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.service.EmailService;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final EmailService emailService;

    public NewsletterController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        Map<String, Object> res = new HashMap<>();

        if (email == null || !email.contains("@")) {
            res.put("success", false);
            res.put("message", "Please enter a valid email address.");
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

        String promoCode = "WELCOME10";

        // Send 10% discount coupon email via EmailService
        try {
            String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>"
                    + "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f4f4;padding:30px 0;'><tr><td align='center'>"
                    + "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<tr><td style='background:#4f46e5;padding:30px;text-align:center;'>"
                    + "<h1 style='color:#ffffff;margin:0;font-size:26px;'>Here's your 10% Off Code! 🎁</h1></td></tr>"
                    + "<tr><td style='padding:40px 30px;color:#333333;'>"
                    + "<p style='font-size:16px;margin-top:0;'>Hi there,</p>"
                    + "<p style='font-size:15px;line-height:1.6;'>Thank you for subscribing to the <strong>ShopWithUs</strong> newsletter!</p>"
                    + "<p style='font-size:15px;line-height:1.6;'>Use the promo code below at checkout to enjoy <strong>10% OFF</strong> your order:</p>"
                    + "<div style='text-align:center;margin:30px 0;background:#f3f4f6;padding:20px;border-radius:8px;border:2px dashed #4f46e5;'>"
                    + "<span style='font-size:28px;font-weight:bold;color:#4f46e5;letter-spacing:4px;'>" + promoCode + "</span>"
                    + "</div>"
                    + "<p style='font-size:14px;color:#666666;text-align:center;'>Valid on all products. Happy shopping!</p>"
                    + "<p style='font-size:13px;color:#888888;border-top:1px solid #eeeeee;padding-top:20px;margin-bottom:0;'>You received this email because you subscribed at ShopWithUs.</p>"
                    + "</td></tr>"
                    + "<tr><td style='background:#f9f9f9;padding:20px 30px;text-align:center;color:#aaaaaa;font-size:12px;'>© 2025 ShopWithUs. All rights reserved.</td></tr>"
                    + "</table></td></tr></table></body></html>";

            emailService.sendEmail(email, "Your 10% Off Discount Code — ShopWithUs 🎁", htmlBody);
            System.out.println("Newsletter coupon email dispatched to: " + email);
        } catch (Exception e) {
            System.err.println("Newsletter email error: " + e.getMessage());
        }

        res.put("success", true);
        res.put("promoCode", promoCode);
        res.put("message", "Thank you for subscribing! Your 10% off code is " + promoCode + ". Check your email inbox!");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
