package com.zosh.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.modal.User;
import com.zosh.modal.Wishlist;
import com.zosh.response.ApiResponse;
import com.zosh.service.UserService;
import com.zosh.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private WishlistService wishlistService;
    private UserService userService;

    public WishlistController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    @GetMapping("/")
    public ResponseEntity<Wishlist> findUserWishlist(@RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.findUserProfileByJwt(jwt);
        Wishlist wishlist = wishlistService.findUserWishlist(user.getId());
        return new ResponseEntity<Wishlist>(wishlist, HttpStatus.OK);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<ApiResponse> addProductToWishlist(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {
        User user = userService.findUserProfileByJwt(jwt);
        String res = wishlistService.addWishlistItem(user.getId(), productId);
        ApiResponse response = new ApiResponse(res, true);
        return new ResponseEntity<ApiResponse>(response, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{wishlistItemId}")
    public ResponseEntity<ApiResponse> removeWishlistItem(
            @PathVariable Long wishlistItemId,
            @RequestHeader("Authorization") String jwt) throws UserException, Exception {
        User user = userService.findUserProfileByJwt(jwt);
        wishlistService.removeWishlistItem(user.getId(), wishlistItemId);
        ApiResponse response = new ApiResponse("Item removed from wishlist", true);
        return new ResponseEntity<ApiResponse>(response, HttpStatus.OK);
    }

}
