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

@RestController
@RequestMapping("/auth")
public class AuthController {

	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private JwtTokenProvider jwtTokenProvider;
	private CustomUserDetails customUserDetails;
	private CartService cartService;
	private EmailService emailService;
	
	public AuthController(UserRepository userRepository,PasswordEncoder passwordEncoder,JwtTokenProvider jwtTokenProvider,CustomUserDetails customUserDetails,CartService cartService, EmailService emailService) {
		this.userRepository=userRepository;
		this.passwordEncoder=passwordEncoder;
		this.jwtTokenProvider=jwtTokenProvider;
		this.customUserDetails=customUserDetails;
		this.cartService=cartService;
		this.emailService = emailService;
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

	        // Send Welcome Email
	        try {
	        	String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>"
	        		+ "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f4f4;padding:30px 0;'><tr><td align='center'>"
	        		+ "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
	        		+ "<tr><td style='background:#9155FD;padding:30px;text-align:center;'>"
	        		+ "<h1 style='color:#ffffff;margin:0;font-size:26px;'>Welcome to ShopWithUs! 🎉</h1></td></tr>"
	        		+ "<tr><td style='padding:40px 30px;color:#333333;'>"
	        		+ "<p style='font-size:18px;margin-top:0;'>Hi <strong>" + firstName + "</strong>,</p>"
	        		+ "<p style='font-size:15px;line-height:1.6;'>Thank you for creating your account! We're excited to have you on board.</p>"
	        		+ "<p style='font-size:15px;line-height:1.6;'>Start exploring thousands of products across fashion, electronics, and more — all at unbeatable prices.</p>"
	        		+ "<div style='text-align:center;margin:30px 0;'>"
	        		+ "<a href='http://localhost:3000' style='background:#9155FD;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;'>Start Shopping</a>"
	        		+ "</div>"
	        		+ "<p style='font-size:13px;color:#888888;border-top:1px solid #eeeeee;padding-top:20px;margin-bottom:0;'>You received this email because you signed up at ShopWithUs. If this wasn't you, please ignore this email.</p>"
	        		+ "</td></tr>"
	        		+ "<tr><td style='background:#f9f9f9;padding:20px 30px;text-align:center;color:#aaaaaa;font-size:12px;'>© 2025 ShopWithUs. All rights reserved.</td></tr>"
	        		+ "</table></td></tr></table></body></html>";
	        	emailService.sendEmail(email, "Welcome to ShopWithUs! Your account is ready 🎉", htmlBody);
	        	System.out.println("Welcome email sent successfully to: " + email);
	        } catch(Exception e) {
	        	System.err.println("[EMAIL ERROR] Failed to send welcome email to: " + email);
	        	System.err.println("[EMAIL ERROR] Cause: " + e.getMessage());
	        	if (e.getCause() != null) System.err.println("[EMAIL ERROR] Root cause: " + e.getCause().getMessage());
	        }


	        AuthResponse authResponse= new AuthResponse(token,true);
			
	        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
		
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
}
