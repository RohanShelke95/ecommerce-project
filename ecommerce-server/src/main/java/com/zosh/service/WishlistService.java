package com.zosh.service;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.modal.User;
import com.zosh.modal.Wishlist;
import com.zosh.modal.WishlistItem;
import com.zosh.request.AddItemRequest;

public interface WishlistService {

    public Wishlist createWishlist(User user);

    public String addWishlistItem(Long userId, Long productId) throws ProductException;

    public Wishlist findUserWishlist(Long userId);

    public void removeWishlistItem(Long userId, Long wishlistItemId) throws UserException, Exception;
}
