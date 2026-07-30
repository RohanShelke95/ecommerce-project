package com.zosh.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.modal.Product;
import com.zosh.modal.User;
import com.zosh.modal.Wishlist;
import com.zosh.modal.WishlistItem;
import com.zosh.repository.WishlistItemRepository;
import com.zosh.repository.WishlistRepository;

@Service
public class WishlistServiceImplementation implements WishlistService {

    private WishlistRepository wishlistRepository;
    private WishlistItemRepository wishlistItemRepository;
    private ProductService productService;

    public WishlistServiceImplementation(WishlistRepository wishlistRepository, WishlistItemRepository wishlistItemRepository, ProductService productService) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productService = productService;
    }

    @Override
    public Wishlist createWishlist(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    @Override
    public String addWishlistItem(Long userId, Long productId) throws ProductException {
        Wishlist wishlist = wishlistRepository.findByUserId(userId);
        if (wishlist == null) {
            User user = new User();
            user.setId(userId);
            wishlist = createWishlist(user);
        }
        Product product = productService.findProductById(productId);
        
        WishlistItem isPresent = wishlistItemRepository.isWishlistItemExist(wishlist, product, userId);
        
        if (isPresent == null) {
            WishlistItem wishlistItem = new WishlistItem();
            wishlistItem.setWishlist(wishlist);
            wishlistItem.setProduct(product);
            wishlistItem.setUserId(userId);
            wishlist.getWishlistItems().add(wishlistItem);
            wishlistItemRepository.save(wishlistItem);
            return "Item Added To Wishlist";
        }
        return "Item Already In Wishlist";
    }

    @Override
    public Wishlist findUserWishlist(Long userId) {
        Wishlist wishlist = wishlistRepository.findByUserId(userId);
        if (wishlist == null) {
            User user = new User();
            user.setId(userId);
            wishlist = createWishlist(user);
        }
        return wishlist;
    }

    @Override
    public void removeWishlistItem(Long userId, Long wishlistItemId) throws UserException, Exception {
        Optional<WishlistItem> opt = wishlistItemRepository.findById(wishlistItemId);
        
        if (opt.isPresent()) {
            WishlistItem wishlistItem = opt.get();
            if (wishlistItem.getUserId().equals(userId)) {
                wishlistItemRepository.deleteById(wishlistItemId);
            } else {
                throw new UserException("You can't remove another user's item");
            }
        } else {
            throw new Exception("Wishlist item not found with id: " + wishlistItemId);
        }
    }
}
