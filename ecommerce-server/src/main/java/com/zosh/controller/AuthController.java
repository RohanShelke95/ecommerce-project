package com.zosh.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.config.JwtTokenProvider;
import com.zosh.exception.UserException;
import com.zosh.modal.Cart;
import com.zosh.modal.User;
import com.zosh.repository.UserRepository;
import com.zosh.request.LoginRequest;
import com.zosh.response.AuthResponse;
import com.zosh.service.CartService;
import com.zosh.service.CustomUserDetails;
import com.zosh.service.EmailService;
import com.zosh.user.domain.UserRole;

import jakarta.validation.Valid;

import com.zosh.request.OtpSignupRequest;
import com.zosh.service.OtpService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private JwtTokenProvider jwtTokenProvider;
	private CustomUserDetails customUserDetails;
	private CartService cartService;
	private EmailService emailService;
	private OtpService otpService;
	
	public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, CustomUserDetails customUserDetails, CartService cartService, EmailService emailService, OtpService otpService) {
		this.userRepository=userRepository;
		this.passwordEncoder=passwordEncoder;
		this.jwtTokenProvider=jwtTokenProvider;
		this.customUserDetails=customUserDetails;
		this.cartService=cartService;
		this.emailService = emailService;
		this.otpService = otpService;
	}
	
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> createUserHandler(@Valid @RequestBody User user) throws UserException{
		
		  	String email = user.getEmail();
	        String password = user.getPassword();
	        String firstName=user.getFirstName();
	        String lastName=user.getLastName();
	        String role=user.getRole();
	        
	        User isEmailExist=userRepository.findByEmail(email);

	        // Check if user with the given email already exists
	        if (isEmailExist!=null) {
	        	
	            throw new UserException("Email Is Already Used With Another Account");
	        }

	        // Create new user
			User createdUser= new User();
			createdUser.setEmail(email);
			createdUser.setFirstName(firstName);
			createdUser.setLastName(lastName);
	        createdUser.setPassword(passwordEncoder.encode(password));
	        // Always assign ROLE_CUSTOMER on signup — never trust client-provided role
	        createdUser.setRole("ROLE_CUSTOMER");
	        
	        User savedUser= userRepository.save(createdUser);
	        
	        cartService.createCart(savedUser);

	        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
	        SecurityContextHolder.getContext().setAuthentication(authentication);
	        
	        String token = jwtTokenProvider.generateToken(authentication);

	        // Send Welcome Email (Amazon / Flipkart Style)
	        try {
	        	String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;'>"
	        		+ "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f5f7;padding:30px 0;'><tr><td align='center'>"
	        		+ "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);'>"
	        		+ "<tr><td style='background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);padding:35px;text-align:center;'>"
	        		+ "<h1 style='color:#ffffff;margin:0;font-size:28px;font-weight:bold;letter-spacing:1px;'>ShopWithUs</h1>"
	        		+ "<p style='color:#e0e7ff;margin:8px 0 0;font-size:16px;'>Registration Successful 🎉</p></td></tr>"
	        		+ "<tr><td style='padding:40px 35px;color:#1f2937;'>"
	        		+ "<h2 style='font-size:20px;color:#111827;margin-top:0;'>Welcome aboard, " + firstName + "!</h2>"
	        		+ "<p style='font-size:15px;line-height:1.6;color:#4b5563;'>Your account has been successfully created. You can now log in, track your orders, save items to your wishlist, and enjoy seamless shopping!</p>"
	        		+ "<table width='100%' cellpadding='14' cellspacing='0' style='background:#f9fafb;border-radius:8px;margin:25px 0;border:1px solid #e5e7eb;'>"
	        		+ "<tr><td style='color:#6b7280;font-size:13px;font-weight:bold;text-transform:uppercase;'>Registered Name</td><td style='font-weight:bold;text-align:right;color:#111827;font-size:14px;'>" + firstName + " " + lastName + "</td></tr>"
	        		+ "<tr style='border-top:1px solid #e5e7eb;'><td style='color:#6b7280;font-size:13px;font-weight:bold;text-transform:uppercase;'>Registered Email</td><td style='font-weight:bold;text-align:right;color:#111827;font-size:14px;'>" + email + "</td></tr>"
	        		+ "<tr style='border-top:1px solid #e5e7eb;'><td style='color:#6b7280;font-size:13px;font-weight:bold;text-transform:uppercase;'>Account Status</td><td style='font-weight:bold;text-align:right;color:#059669;font-size:14px;'>Active ✅</td></tr>"
	        		+ "</table>"
	        		+ "<div style='background:#eef2ff;border:2px dashed #6366f1;border-radius:8px;padding:20px;text-align:center;margin:30px 0;'>"
	        		+ "<p style='margin:0 0 8px;font-size:14px;color:#4338ca;font-weight:bold;text-transform:uppercase;'>Exclusive Welcome Gift 🎁</p>"
	        		+ "<p style='margin:0 0 10px;font-size:13px;color:#4b5563;'>Use coupon code at checkout for 10% OFF your first purchase:</p>"
	        		+ "<span style='font-size:26px;font-weight:extrabold;color:#4f46e5;letter-spacing:4px;'>WELCOME10</span>"
	        		+ "</div>"
	        		+ "<div style='text-align:center;margin:35px 0 20px;'>"
	        		+ "<a href='https://www.rohanshelke.shop' style='background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);color:#ffffff;text-decoration:none;padding:15px 38px;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;box-shadow:0 4px 12px rgba(79,70,229,0.3);'>Start Shopping Now</a>"
	        		+ "</div>"
	        		+ "<p style='font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:20px;margin-bottom:0;'>If you did not register for an account at ShopWithUs, please ignore this email or contact support.</p>"
	        		+ "</td></tr>"
	        		+ "<tr><td style='background:#f9fafb;padding:20px 35px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;'>© " + java.time.Year.now().getValue() + " ShopWithUs. All rights reserved.</td></tr>"
	        		+ "</table></td></tr></table></body></html>";
	        	emailService.sendEmail(email, "Welcome to ShopWithUs! Account Created Successfully 🎉", htmlBody);
	        	System.out.println("Welcome email sent successfully to: " + email);
	        } catch(Exception e) {
	        	System.err.println("[EMAIL ERROR] Failed to send welcome email to: " + email);
	        }


	        AuthResponse authResponse= new AuthResponse(token,true);
			
	        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
		
	}

	@PostMapping("/send-otp")
	public ResponseEntity<ApiResponse> sendOtpHandler(@RequestBody Map<String, String> req) throws UserException {
		String email = req.get("email");
		if (email == null || email.isBlank() || !email.contains("@")) {
			throw new UserException("Please provide a valid email address.");
		}

		User isEmailExist = userRepository.findByEmail(email.trim().toLowerCase());
		if (isEmailExist != null) {
			throw new UserException("Email Is Already Used With Another Account");
		}

		String otp = otpService.generateOtp(email);

		// Send Amazon-Style Verification Code Email
		try {
			String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;'>"
					+ "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f5f7;padding:30px 0;'><tr><td align='center'>"
					+ "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);'>"
					+ "<tr><td style='background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);padding:30px;text-align:center;'>"
					+ "<h1 style='color:#ffffff;margin:0;font-size:26px;font-weight:bold;'>ShopWithUs</h1>"
					+ "<p style='color:#e0e7ff;margin:5px 0 0;font-size:14px;'>Email Verification Code</p></td></tr>"
					+ "<tr><td style='padding:40px 35px;color:#1f2937;'>"
					+ "<p style='font-size:16px;margin-top:0;'>Verify your email address</p>"
					+ "<p style='font-size:14px;color:#4b5563;line-height:1.6;'>Use the 6-digit One-Time Password (OTP) below to complete your registration:</p>"
					+ "<div style='text-align:center;margin:30px 0;background:#f3f4f6;padding:20px;border-radius:8px;border:2px dashed #4f46e5;'>"
					+ "<span style='font-size:34px;font-weight:extrabold;color:#4f46e5;letter-spacing:6px;'>" + otp + "</span>"
					+ "</div>"
					+ "<p style='font-size:13px;color:#6b7280;text-align:center;'>This verification code is valid for <strong>10 minutes</strong>. For your security, do not share this code with anyone.</p>"
					+ "<p style='font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:20px;margin-bottom:0;'>If you did not request this verification code, please ignore this message.</p>"
					+ "</td></tr>"
					+ "<tr><td style='background:#f9fafb;padding:20px 35px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;'>© " + java.time.Year.now().getValue() + " ShopWithUs. All rights reserved.</td></tr>"
					+ "</table></td></tr></table></body></html>";

			emailService.sendEmail(email, "ShopWithUs Verification Code: " + otp, htmlBody);
			System.out.println("OTP email dispatched to: " + email);
		} catch (Exception e) {
			System.err.println("Failed to send OTP email: " + e.getMessage());
		}

		ApiResponse res = new ApiResponse("Verification code sent to " + email, true);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	@PostMapping("/signup-verify")
	public ResponseEntity<AuthResponse> verifyOtpAndSignupHandler(@Valid @RequestBody OtpSignupRequest req) throws UserException {
		String email = req.getEmail();
		String otp = req.getOtp();
		String firstName = req.getFirstName();
		String lastName = req.getLastName();
		String password = req.getPassword();

		if (email == null || otp == null || password == null) {
			throw new UserException("Email, OTP code, and password are required.");
		}

		// Validate OTP
		boolean isValid = otpService.validateOtp(email, otp);
		if (!isValid) {
			throw new UserException("Invalid or expired verification code. Please check your email and try again.");
		}

		// Check duplicate user again
		User isEmailExist = userRepository.findByEmail(email.trim().toLowerCase());
		if (isEmailExist != null) {
			throw new UserException("Email Is Already Used With Another Account");
		}

		// Create user
		User createdUser = new User();
		createdUser.setEmail(email.trim().toLowerCase());
		createdUser.setFirstName(firstName);
		createdUser.setLastName(lastName);
		createdUser.setPassword(passwordEncoder.encode(password));
		createdUser.setRole("ROLE_CUSTOMER");

		User savedUser = userRepository.save(createdUser);
		cartService.createCart(savedUser);

		Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String token = jwtTokenProvider.generateToken(authentication);

		// Send Welcome Email
		try {
			String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;'>"
					+ "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f5f7;padding:30px 0;'><tr><td align='center'>"
					+ "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);'>"
					+ "<tr><td style='background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);padding:35px;text-align:center;'>"
					+ "<h1 style='color:#ffffff;margin:0;font-size:28px;font-weight:bold;'>ShopWithUs</h1>"
					+ "<p style='color:#e0e7ff;margin:8px 0 0;font-size:16px;'>Registration Successful 🎉</p></td></tr>"
					+ "<tr><td style='padding:40px 35px;color:#1f2937;'>"
					+ "<h2 style='font-size:20px;color:#111827;margin-top:0;'>Welcome aboard, " + firstName + "!</h2>"
					+ "<p style='font-size:15px;line-height:1.6;color:#4b5563;'>Your account has been successfully created. You can now log in, track your orders, save items to your wishlist, and enjoy seamless shopping!</p>"
					+ "<div style='background:#eef2ff;border:2px dashed #6366f1;border-radius:8px;padding:20px;text-align:center;margin:30px 0;'>"
					+ "<p style='margin:0 0 8px;font-size:14px;color:#4338ca;font-weight:bold;text-transform:uppercase;'>Exclusive Welcome Gift 🎁</p>"
					+ "<span style='font-size:26px;font-weight:extrabold;color:#4f46e5;letter-spacing:4px;'>WELCOME10</span>"
					+ "</div>"
					+ "<div style='text-align:center;margin:35px 0 20px;'>"
					+ "<a href='https://www.rohanshelke.shop' style='background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);color:#ffffff;text-decoration:none;padding:15px 38px;border-radius:8px;font-size:16px;font-weight:bold;display:inline-block;'>Start Shopping Now</a>"
					+ "</div>"
					+ "</td></tr>"
					+ "<tr><td style='background:#f9fafb;padding:20px 35px;text-align:center;color:#9ca3af;font-size:12px;'>© " + java.time.Year.now().getValue() + " ShopWithUs. All rights reserved.</td></tr>"
					+ "</table></td></tr></table></body></html>";

			emailService.sendEmail(email, "Welcome to ShopWithUs! Account Created Successfully 🎉", htmlBody);
		} catch (Exception e) {
			System.err.println("Welcome email error: " + e.getMessage());
		}

		AuthResponse authResponse = new AuthResponse(token, true);
		return new ResponseEntity<>(authResponse, HttpStatus.OK);
	}
	
	@PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        
        System.out.println(username +" ----- "+password);
        
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        
        String token = jwtTokenProvider.generateToken(authentication);
        AuthResponse authResponse= new AuthResponse();
		
		authResponse.setStatus(true);
		authResponse.setJwt(token);
		
        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
    }
	
	private Authentication authenticate(String username, String password) {
        UserDetails userDetails = customUserDetails.loadUserByUsername(username);
        
        System.out.println("sign in userDetails - "+userDetails);
        
        if (userDetails == null) {
        	System.out.println("sign in userDetails - null " + userDetails);
            throw new BadCredentialsException("Invalid username or password");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
        	System.out.println("sign in userDetails - password not match " + userDetails);
            throw new BadCredentialsException("Invalid username or password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

	/**
	 * Step 1 – Forgot Password: send a 6-digit OTP to the registered email.
	 */
	@PostMapping("/forgot-password")
	public ResponseEntity<ApiResponse> forgotPassword(@RequestBody Map<String, String> req) throws UserException {
		String email = req.get("email");
		if (email == null || email.isBlank() || !email.contains("@")) {
			throw new UserException("Please provide a valid email address.");
		}

		User user = userRepository.findByEmail(email.trim().toLowerCase());
		if (user == null) {
			throw new UserException("No account found with this email address.");
		}

		String otp = otpService.generateOtp(email);

		try {
			String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;'>"
					+ "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f5f7;padding:30px 0;'><tr><td align='center'>"
					+ "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);'>"
					+ "<tr><td style='background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);padding:30px;text-align:center;'>"
					+ "<h1 style='color:#ffffff;margin:0;font-size:26px;font-weight:bold;'>ShopWithUs</h1>"
					+ "<p style='color:#e0e7ff;margin:5px 0 0;font-size:14px;'>Password Reset Request</p></td></tr>"
					+ "<tr><td style='padding:40px 35px;color:#1f2937;'>"
					+ "<p style='font-size:16px;margin-top:0;'>Hi <strong>" + user.getFirstName() + "</strong>,</p>"
					+ "<p style='font-size:14px;color:#4b5563;line-height:1.6;'>We received a request to reset the password for your ShopWithUs account. Use the 6-digit code below to reset your password:</p>"
					+ "<div style='text-align:center;margin:30px 0;background:#f3f4f6;padding:24px;border-radius:8px;border:2px dashed #ef4444;'>"
					+ "<span style='font-size:34px;font-weight:extrabold;color:#ef4444;letter-spacing:6px;'>" + otp + "</span>"
					+ "</div>"
					+ "<p style='font-size:13px;color:#6b7280;text-align:center;'>This code is valid for <strong>10 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.</p>"
					+ "<p style='font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:20px;margin-bottom:0;'>For security reasons, never share this code with anyone.</p>"
					+ "</td></tr>"
					+ "<tr><td style='background:#f9fafb;padding:20px 35px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;'>© " + java.time.Year.now().getValue() + " ShopWithUs. All rights reserved.</td></tr>"
					+ "</table></td></tr></table></body></html>";

			emailService.sendEmail(email, "ShopWithUs Password Reset Code: " + otp, htmlBody);
			System.out.println("Password reset OTP sent to: " + email);
		} catch (Exception e) {
			System.err.println("Password reset email error: " + e.getMessage());
		}

		ApiResponse res = new ApiResponse("Password reset code sent to " + email, true);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	/**
	 * Step 2 – Reset Password: verify OTP and set a new password.
	 */
	@PostMapping("/reset-password")
	public ResponseEntity<ApiResponse> resetPassword(@RequestBody Map<String, String> req) throws UserException {
		String email = req.get("email");
		String otp = req.get("otp");
		String newPassword = req.get("newPassword");

		if (email == null || otp == null || newPassword == null) {
			throw new UserException("Email, OTP code, and new password are required.");
		}
		if (newPassword.length() < 6) {
			throw new UserException("New password must be at least 6 characters.");
		}

		boolean isValid = otpService.validateOtp(email, otp);
		if (!isValid) {
			throw new UserException("Invalid or expired verification code. Please request a new one.");
		}

		User user = userRepository.findByEmail(email.trim().toLowerCase());
		if (user == null) {
			throw new UserException("No account found with this email address.");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);

		// Send password-changed confirmation email
		try {
			String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;'>"
					+ "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f5f7;padding:30px 0;'><tr><td align='center'>"
					+ "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.08);'>"
					+ "<tr><td style='background:linear-gradient(135deg, #059669 0%, #10b981 100%);padding:30px;text-align:center;'>"
					+ "<h1 style='color:#ffffff;margin:0;font-size:26px;font-weight:bold;'>ShopWithUs</h1>"
					+ "<p style='color:#d1fae5;margin:5px 0 0;font-size:14px;'>Password Changed Successfully ✅</p></td></tr>"
					+ "<tr><td style='padding:40px 35px;color:#1f2937;'>"
					+ "<p style='font-size:16px;margin-top:0;'>Hi <strong>" + user.getFirstName() + "</strong>,</p>"
					+ "<p style='font-size:14px;color:#4b5563;line-height:1.6;'>Your ShopWithUs account password has been successfully reset. You can now log in with your new password.</p>"
					+ "<div style='text-align:center;margin:30px 0;'>"
					+ "<a href='https://www.rohanshelke.shop/login' style='background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:bold;display:inline-block;'>Log In to ShopWithUs</a>"
					+ "</div>"
					+ "<p style='font-size:13px;color:#ef4444;'>If you did not make this change, please contact our support team immediately.</p>"
					+ "</td></tr>"
					+ "<tr><td style='background:#f9fafb;padding:20px 35px;text-align:center;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;'>© " + java.time.Year.now().getValue() + " ShopWithUs. All rights reserved.</td></tr>"
					+ "</table></td></tr></table></body></html>";

			emailService.sendEmail(email, "ShopWithUs — Your Password Has Been Changed", htmlBody);
		} catch (Exception e) {
			System.err.println("Password changed confirmation email error: " + e.getMessage());
		}

		ApiResponse res = new ApiResponse("Password reset successfully. You can now log in.", true);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}
}

