package com.zosh.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.exception.ProductException;
import com.zosh.modal.Product;
import com.zosh.response.ProductFiltersResponse;
import com.zosh.service.ProductService;
import com.zosh.user.domain.ProductSubCategory;

@RestController
@RequestMapping("/api")
public class UserProductController {
	
	private ProductService productService;
	
	public UserProductController(ProductService productService) {
		this.productService=productService;
	}
	
	
	@GetMapping("/products/filters")
	public ResponseEntity<ProductFiltersResponse> getProductFiltersHandler(
			@RequestParam String category,
			@RequestParam(required = false) String lavelOne) {
		ProductFiltersResponse filters = productService.getProductFilters(category, lavelOne);
		return new ResponseEntity<>(filters, HttpStatus.OK);
	}

	@GetMapping("/products")
	public ResponseEntity<Page<Product>> findProductByCategoryHandler(
			@RequestParam(required = false, defaultValue = "") String category,
			@RequestParam(required = false) List<String> color,
			@RequestParam(required = false) List<String> size,
			@RequestParam(required = false, defaultValue = "0") Integer minPrice,
			@RequestParam(required = false, defaultValue = "1000000") Integer maxPrice,
			@RequestParam(required = false, defaultValue = "0") Integer minDiscount,
			@RequestParam(required = false, defaultValue = "price_low") String sort,
			@RequestParam(required = false, defaultValue = "") String stock,
			@RequestParam(required = false, defaultValue = "0") Integer pageNumber,
			@RequestParam(required = false, defaultValue = "10") Integer pageSize,
			@RequestParam(required = false, defaultValue = "") String lavelOne) {

		List<String> safeColor = color != null ? color : java.util.Collections.emptyList();
		List<String> safeSize = size != null ? size : java.util.Collections.emptyList();

		Page<Product> res = productService.getAllProduct(
				category, safeColor, safeSize, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize, lavelOne);
		return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
	}
	

	
	@GetMapping("/products/id/{productId}")
	public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId) throws ProductException{
		
		Product product=productService.findProductById(productId);
		
		return new ResponseEntity<Product>(product,HttpStatus.ACCEPTED);
	}

	@GetMapping("/products/search/filters")
	public ResponseEntity<ProductFiltersResponse> getSearchProductFiltersHandler(@RequestParam String q) {
		ProductFiltersResponse filters = productService.getSearchProductFilters(q);
		return new ResponseEntity<>(filters, HttpStatus.OK);
	}

	@GetMapping("/products/search/filtered")
	public ResponseEntity<Page<Product>> searchProductsFilteredHandler(
			@RequestParam String q,
			@RequestParam List<String> color,
			@RequestParam List<String> size,
			@RequestParam Integer minPrice,
			@RequestParam Integer maxPrice,
			@RequestParam Integer minDiscount,
			@RequestParam String sort,
			@RequestParam String stock,
			@RequestParam Integer pageNumber,
			@RequestParam Integer pageSize) {
		Page<Product> products = productService.searchProducts(
				q, color, size, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize);
		return new ResponseEntity<>(products, HttpStatus.OK);
	}

	@GetMapping("/products/search")
	public ResponseEntity<List<Product>> searchProductHandler(@RequestParam String q){
		
		List<Product> products=productService.searchProduct(q);
		
		return new ResponseEntity<List<Product>>(products,HttpStatus.OK);
		
	}
}
