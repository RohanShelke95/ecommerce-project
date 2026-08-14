package com.zosh.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.zosh.exception.ProductException;
import com.zosh.modal.Product;
import com.zosh.request.CreateProductRequest;
import com.zosh.response.ApiResponse;
import com.zosh.service.ProductService;

import com.zosh.config.DatabaseSeeder;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {
	
	private ProductService productService;
	private DatabaseSeeder databaseSeeder;
	
	public AdminProductController(ProductService productService, DatabaseSeeder databaseSeeder) {
		this.productService = productService;
		this.databaseSeeder = databaseSeeder;
	}

	@CrossOrigin(origins = "*")
	@GetMapping("/seed-demo")
	public ResponseEntity<ApiResponse> seedDemoProductsGetHandler() {
		try {
			databaseSeeder.run(new String[0]);
			ApiResponse res = new ApiResponse("Database reset & 10 products per category seeded successfully!", true);
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			ApiResponse res = new ApiResponse("Seeding failed: " + e.getMessage(), false);
			return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

@CrossOrigin(origins = "*")
	@PostMapping("/seed-demo")
	public ResponseEntity<ApiResponse> seedDemoProductsHandler() {
		try {
			databaseSeeder.run(new String[0]);
			ApiResponse res = new ApiResponse("Database reset & 10 products per category seeded successfully!", true);
			return new ResponseEntity<>(res, HttpStatus.OK);
		} catch (Exception e) {
			ApiResponse res = new ApiResponse("Seeding failed: " + e.getMessage(), false);
			return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@PostMapping("/")
	public ResponseEntity<Product> createProductHandler(@RequestBody CreateProductRequest req) throws ProductException{
		
		Product createdProduct = productService.createProduct(req);
		
		return new ResponseEntity<Product>(createdProduct,HttpStatus.ACCEPTED);
		
	}
	
	@DeleteMapping("/{productId}/delete")
	public ResponseEntity<ApiResponse> deleteProductHandler(@PathVariable Long productId) throws ProductException{
		
		System.out.println("dlete product controller .... ");
		String msg=productService.deleteProduct(productId);
		System.out.println("dlete product controller .... msg "+msg);
		ApiResponse res=new ApiResponse(msg,true);
		
		return new ResponseEntity<ApiResponse>(res,HttpStatus.ACCEPTED);
		
	}
	
	@GetMapping("/all")
	public ResponseEntity<List<Product>> findAllProduct(){
		
		List<Product> products = productService.getAllProducts();
		
		return new ResponseEntity<List<Product>>(products,HttpStatus.OK);
	}
	
	@GetMapping("/recent")
	public ResponseEntity<List<Product>> recentlyAddedProduct(){
		
		List<Product> products = productService.recentlyAddedProduct();
		
		return new ResponseEntity<List<Product>>(products,HttpStatus.OK);
	}
	
	
	@PutMapping("/{productId}/update")
	public ResponseEntity<Product> updateProductHandler(@RequestBody Product req,@PathVariable Long productId) throws ProductException{
		
		Product updatedProduct=productService.updateProduct(productId, req);
		
		return new ResponseEntity<Product>(updatedProduct,HttpStatus.OK);
	}
	
	@PostMapping("/creates")
	public ResponseEntity<ApiResponse> createMultipleProduct(@RequestBody CreateProductRequest[] reqs) throws ProductException{
		
		for(CreateProductRequest product:reqs) {
			productService.createProduct(product);
		}
		
		ApiResponse res=new ApiResponse("products created successfully",true);
		return new ResponseEntity<ApiResponse>(res,HttpStatus.ACCEPTED);
	}

}
