package com.zosh.service;

import org.springframework.stereotype.Service;

import com.zosh.exception.ProductException;
import com.zosh.modal.Cart;
import com.zosh.modal.CartItem;
import com.zosh.modal.Product;
import com.zosh.modal.User;
import com.zosh.repository.CartRepository;
import com.zosh.request.AddItemRequest;

@Service
public class CartServiceImplementation implements CartService{
	
	private CartRepository cartRepository;
	private CartItemService cartItemService;
	private ProductService productService;
	private UserService userService;
	
	public CartServiceImplementation(CartRepository cartRepository, CartItemService cartItemService,
			ProductService productService, UserService userService) {
		this.cartRepository=cartRepository;
		this.productService=productService;
		this.cartItemService=cartItemService;
		this.userService=userService;
	}

	@Override
	public Cart createCart(User user) {
		
		Cart cart = new Cart();
		cart.setUser(user);
		Cart createdCart=cartRepository.save(cart);
		return createdCart;
	}
	
	public Cart findUserCart(Long userId) {
		Cart cart =	cartRepository.findByUserId(userId);
		if (cart == null) {
			try {
				User user = userService.findUserById(userId);
				cart = createCart(user);
			} catch (Exception e) {
				cart = new Cart();
			}
		}
		int totalPrice=0;
		int totalDiscountedPrice=0;
		int totalItem=0;
		if (cart.getCartItems() != null) {
			for(CartItem cartsItem : cart.getCartItems()) {
				totalPrice+=cartsItem.getPrice();
				totalDiscountedPrice+=cartsItem.getDiscountedPrice();
				totalItem+=cartsItem.getQuantity();
			}
		}
		
		cart.setTotalPrice(totalPrice);
		cart.setTotalItem(cart.getCartItems() != null ? cart.getCartItems().size() : 0);
		cart.setTotalDiscountedPrice(totalDiscountedPrice);
		cart.setDiscounte(totalPrice-totalDiscountedPrice);
		cart.setTotalItem(totalItem);
		
		return cartRepository.save(cart);
		
	}

	@Override
	public CartItem addCartItem(Long userId, AddItemRequest req) throws ProductException {
		Cart cart = cartRepository.findByUserId(userId);
		if (cart == null) {
			try {
				User user = userService.findUserById(userId);
				cart = createCart(user);
			} catch (Exception e) {
				throw new ProductException("User cart not found and could not be created");
			}
		}
		Product product = productService.findProductById(req.getProductId());
		
		CartItem isPresent = cartItemService.isCartItemExist(cart, product, req.getSize(), userId);
		
		if(isPresent == null) {
			CartItem cartItem = new CartItem();
			cartItem.setProduct(product);
			cartItem.setCart(cart);
			int quantity = req.getQuantity() > 0 ? req.getQuantity() : 1;
			cartItem.setQuantity(quantity);
			cartItem.setUserId(userId);
			
			int price = quantity * product.getPrice();
			int discountedPrice = quantity * product.getDiscountedPrice();
			cartItem.setPrice(price);
			cartItem.setDiscountedPrice(discountedPrice);
			cartItem.setSize(req.getSize());
			
			CartItem createdCartItem = cartItemService.createCartItem(cartItem);
			cart.getCartItems().add(createdCartItem);
			cartRepository.save(cart);
			return createdCartItem;
		} else {
			try {
				int addQty = req.getQuantity() > 0 ? req.getQuantity() : 1;
				isPresent.setQuantity(isPresent.getQuantity() + addQty);
				return cartItemService.updateCartItem(userId, isPresent.getId(), isPresent);
			} catch (Exception e) {
				return isPresent;
			}
		}
	}

}
