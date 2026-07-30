package com.zosh.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.zosh.modal.Product;
import com.zosh.user.domain.ProductSubCategory;


public interface ProductRepository extends JpaRepository<Product, Long> {

	@Query("SELECT p From Product p Where LOWER(p.category.name)=:category")
	public List<Product> findByCategory(@Param("category") String category);
	
	@Query("SELECT p FROM Product p " +
	       "LEFT JOIN p.category c " +
	       "LEFT JOIN c.parentCategory pc " +
	       "LEFT JOIN pc.parentCategory gpc " +
	       "WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	       "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	       "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	       "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	       "LOWER(pc.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
	       "LOWER(gpc.name) LIKE LOWER(CONCAT('%', :query, '%'))")
	public List<Product> searchProduct(@Param("query")String query);
	


	
	@Query("SELECT p FROM Product p " +
	        "LEFT JOIN p.category c " +
	        "LEFT JOIN c.parentCategory pc " +
	        "LEFT JOIN pc.parentCategory gpc " +
	        "WHERE (:category IS NULL OR :category = '' " +
	        "  OR LOWER(c.name) = LOWER(:category) " +
	        "  OR LOWER(pc.name) = LOWER(:category) " +
	        "  OR LOWER(gpc.name) = LOWER(:category)) " +
	        "AND (((:minPrice IS NULL OR :minPrice = 0) AND (:maxPrice IS NULL OR :maxPrice = 0)) OR (p.discountedPrice BETWEEN :minPrice AND :maxPrice)) " +
		    "AND (:minDiscount IS NULL OR :minDiscount = 0 OR p.discountPersent >= :minDiscount) " +
		    "ORDER BY " +
		    "CASE WHEN :sort = 'price_low' THEN p.discountedPrice END ASC, " +
		    "CASE WHEN :sort = 'price_high' THEN p.discountedPrice END DESC, "+
		    "p.createdAt DESC")
	List<Product> filterProducts(
	        @Param("category") String category,
			@Param("minPrice") Integer minPrice,
			@Param("maxPrice") Integer maxPrice,
			@Param("minDiscount") Integer minDiscount,
			@Param("sort") String sort
			);
	
	public List<Product> findTop10ByOrderByCreatedAtDesc();
}
