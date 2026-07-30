package com.zosh.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.exception.UserException;
import com.zosh.modal.Category;
import com.zosh.repository.CategoryRepository;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

	@Autowired
	private CategoryRepository categoryRepository;

	@PostMapping("/")
	public ResponseEntity<Category> createCategory(@RequestBody Category category) {
		Category createdCategory = categoryRepository.save(category);
		return new ResponseEntity<Category>(createdCategory, HttpStatus.ACCEPTED);
	}

	@DeleteMapping("/{categoryId}")
	public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
		categoryRepository.deleteById(categoryId);
		return new ResponseEntity<String>("Category deleted successfully", HttpStatus.ACCEPTED);
	}

	@GetMapping("/")
	public ResponseEntity<List<Category>> getAllCategories() {
		List<Category> categories = categoryRepository.findAll();
		return new ResponseEntity<List<Category>>(categories, HttpStatus.ACCEPTED);
	}
}
