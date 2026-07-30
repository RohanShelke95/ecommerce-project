package com.zosh.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.exception.UserException;
import com.zosh.modal.Address;
import com.zosh.modal.User;
import com.zosh.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
	
	private UserService userService;
	
	public UserController(UserService userService) {
		this.userService=userService;
	}
	
	@GetMapping("/profile")
	public ResponseEntity<User> getUserProfileHandler(@RequestHeader("Authorization") String jwt) throws UserException{

		System.out.println("/api/users/profile");
		User user=userService.findUserProfileByJwt(jwt);
		return new ResponseEntity<User>(user,HttpStatus.ACCEPTED);
	}

	@PutMapping("/address/{addressId}")
	public ResponseEntity<Address> updateAddressHandler(
			@RequestHeader("Authorization") String jwt,
			@PathVariable Long addressId,
			@RequestBody Address address) throws UserException {
		
		System.out.println("PUT /api/users/address/" + addressId);
		Address updatedAddress = userService.updateAddress(addressId, address);
		return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
	}

}
