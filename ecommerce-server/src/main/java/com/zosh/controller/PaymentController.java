package com.zosh.controller;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.zosh.exception.OrderException;
import com.zosh.exception.UserException;
import com.zosh.modal.Order;
import com.zosh.modal.User;
import com.zosh.repository.OrderRepository;
import com.zosh.response.ApiResponse;
import com.zosh.response.PaymentLinkResponse;
import com.zosh.service.OrderService;
import com.zosh.service.UserService;
import com.zosh.service.EmailService;
import com.zosh.user.domain.OrderStatus;
import com.zosh.user.domain.PaymentStatus;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/api")
public class PaymentController {
	
	   @Value("${razorpay.api.key}")
	    private String apiKey;

	    @Value("${razorpay.api.secret}")
	    private String apiSecret;
	
	private OrderService orderService;
	private UserService userService;
	private OrderRepository orderRepository;
	private EmailService emailService;
	
	public PaymentController(OrderService orderService,UserService userService,OrderRepository orderRepository, EmailService emailService) {
		this.orderService=orderService;
		this.userService=userService;
		this.orderRepository=orderRepository;
		this.emailService = emailService;
	}
	
	@PostMapping("/payments/{orderId}")
	public ResponseEntity<?> createPaymentLink(@PathVariable Long orderId,
			@RequestHeader("Authorization")String jwt) 
					throws UserException, OrderException{
		
		Order order=orderService.findOrderById(orderId);
		 try {
			  // Validate Razorpay credentials are configured
			  if (apiKey == null || apiKey.isBlank() || apiKey.contains("provide") ||
			      apiSecret == null || apiSecret.isBlank() || apiSecret.contains("provide")) {
			      Map<String, String> errorBody = new HashMap<>();
			      errorBody.put("message", "Razorpay API keys are not configured. Please add your razorpay.api.key and razorpay.api.secret in application.properties.");
			      return new ResponseEntity<>(errorBody, HttpStatus.BAD_REQUEST);
			  }
			  
		      // Instantiate a Razorpay client with your key ID and secret
		      RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

		      // Create a JSON object with the payment link request parameters
		      JSONObject paymentLinkRequest = new JSONObject();
		      paymentLinkRequest.put("amount",order.getTotalDiscountedPrice()* 100);
		      paymentLinkRequest.put("currency","INR");    

		      // Create a JSON object with the customer details
		      JSONObject customer = new JSONObject();
		      customer.put("name",order.getUser().getFirstName()+" "+order.getUser().getLastName());
		      customer.put("contact",order.getUser().getMobile());
		      customer.put("email",order.getUser().getEmail());
		      paymentLinkRequest.put("customer",customer);

		      // Create a JSON object with the notification settings
		      JSONObject notify = new JSONObject();
		      notify.put("sms",true);
		      notify.put("email",true);
		      paymentLinkRequest.put("notify",notify);

		      // Set the reminder settings
		      paymentLinkRequest.put("reminder_enable",true);

		      // Set the callback URL and method
		      paymentLinkRequest.put("callback_url","http://localhost:3000/payment/"+orderId);
		      paymentLinkRequest.put("callback_method","get");

		      // Create the payment link using the paymentLink.create() method
		      PaymentLink payment = razorpay.paymentLink.create(paymentLinkRequest);
		      
		      String paymentLinkId = payment.get("id");
		      String paymentLinkUrl = payment.get("short_url");
		      
		      PaymentLinkResponse res=new PaymentLinkResponse(paymentLinkUrl,paymentLinkId);
		      
		      PaymentLink fetchedPayment = razorpay.paymentLink.fetch(paymentLinkId);
		      
		      order.setOrderId(fetchedPayment.get("order_id"));
		      orderRepository.save(order);
		      
		   // Print the payment link ID and URL
		      System.out.println("Payment link ID: " + paymentLinkId);
		      System.out.println("Payment link URL: " + paymentLinkUrl);
		      System.out.println("Order Id : "+fetchedPayment.get("order_id")+fetchedPayment);
		      
		      return new ResponseEntity<PaymentLinkResponse>(res,HttpStatus.ACCEPTED);
		      
		    } catch (RazorpayException e) {
		    	
		      System.out.println("Error creating payment link: " + e.getMessage());
		      Map<String, String> errorBody = new HashMap<>();
		      errorBody.put("message", "Payment gateway error: " + e.getMessage());
		      return new ResponseEntity<>(errorBody, HttpStatus.BAD_REQUEST);
		    }
		
		
	}
	
  @GetMapping("/payments")
  public ResponseEntity<ApiResponse> redirect(@RequestParam(name="payment_id") String paymentId,@RequestParam("order_id")Long orderId) throws RazorpayException, OrderException {
	  RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
	  Order order =orderService.findOrderById(orderId);
	
	  try {
		
		
		Payment payment = razorpay.payments.fetch(paymentId);
		System.out.println("payment details --- "+payment+payment.get("status"));
		
		if(payment.get("status").equals("captured")) {
			System.out.println("payment details --- "+payment+payment.get("status"));
		  
			order.getPaymentDetails().setPaymentId(paymentId);
			order.getPaymentDetails().setStatus(PaymentStatus.COMPLETED);
			order.setOrderStatus(OrderStatus.PLACED);
//			order.setOrderItems(order.getOrderItems());
			System.out.println(order.getPaymentDetails().getStatus()+"payment status ");
			orderRepository.save(order);

			// Send Order Confirmation Email
				try {
					String htmlBody = "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>"
							+ "<table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f4f4;padding:30px 0;'><tr><td align='center'>"
							+ "<table width='600' cellpadding='0' cellspacing='0' style='background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
							+ "<tr><td style='background:#9155FD;padding:30px;text-align:center;'>"
							+ "<h1 style='color:#ffffff;margin:0;font-size:26px;'>Order Confirmed! ✅</h1></td></tr>"
							+ "<tr><td style='padding:40px 30px;color:#333333;'>"
							+ "<p style='font-size:18px;margin-top:0;'>Hi <strong>" + order.getUser().getFirstName() + "</strong>,</p>"
							+ "<p style='font-size:15px;line-height:1.6;'>Great news! Your order has been successfully placed and is being processed.</p>"
							+ "<table width='100%' cellpadding='12' cellspacing='0' style='background:#f9f9f9;border-radius:6px;margin:20px 0;'>"
							+ "<tr><td style='color:#888888;font-size:13px;'>Order ID</td><td style='font-weight:bold;text-align:right;'>#" + order.getId() + "</td></tr>"
							+ "<tr style='border-top:1px solid #eeeeee;'><td style='color:#888888;font-size:13px;'>Total Amount</td><td style='font-weight:bold;font-size:18px;color:#9155FD;text-align:right;'>₹" + order.getTotalDiscountedPrice() + "</td></tr>"
							+ "</table>"
							+ "<div style='text-align:center;margin:30px 0;'>"
							+ "<a href='http://localhost:3000/account/order' style='background:#9155FD;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;'>View My Orders</a>"
							+ "</div>"
							+ "<p style='font-size:13px;color:#888888;border-top:1px solid #eeeeee;padding-top:20px;margin-bottom:0;'>You received this email because you placed an order at ShopWithUs.</p>"
							+ "</td></tr>"
							+ "<tr><td style='background:#f9f9f9;padding:20px 30px;text-align:center;color:#aaaaaa;font-size:12px;'>© 2025 ShopWithUs. All rights reserved.</td></tr>"
							+ "</table></td></tr></table></body></html>";
					emailService.sendEmail(order.getUser().getEmail(), "Order Confirmed #" + order.getId() + " — ShopWithUs", htmlBody);
					System.out.println("Order confirmation email sent to: " + order.getUser().getEmail());
				} catch(Exception e) {
					System.out.println("Failed to send order email: " + e.getMessage());
				}
		}
		ApiResponse res=new ApiResponse("your order get placed", true);
	      return new ResponseEntity<ApiResponse>(res,HttpStatus.OK);
	      
	} catch (Exception e) {
		System.out.println("errrr payment -------- ");
		new RedirectView("https://shopwithzosh.vercel.app/payment/failed");
		throw new RazorpayException(e.getMessage());
	}

  }

}
