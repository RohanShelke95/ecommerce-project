package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import com.zosh.modal.Wishlist;
import com.zosh.modal.WishlistItem;
import com.zosh.modal.Product;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    @Query("SELECT wi FROM WishlistItem wi WHERE wi.wishlist=:wishlist AND wi.product=:product AND wi.userId=:userId")
    public WishlistItem isWishlistItemExist(@Param("wishlist") Wishlist wishlist, @Param("product") Product product, @Param("userId") Long userId);

    List<WishlistItem> findByProduct(Product product);
}
