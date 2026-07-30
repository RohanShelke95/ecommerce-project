package com.zosh.service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.zosh.exception.ProductException;
import com.zosh.modal.Category;
import com.zosh.modal.Product;
import com.zosh.modal.Size;
import com.zosh.repository.CategoryRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.request.CreateProductRequest;
import com.zosh.response.ProductFiltersResponse;
import com.zosh.util.SizeFilterHelper;
import com.zosh.user.domain.ProductSubCategory;

@Service
public class ProductServiceImplementation implements ProductService {
	
	private ProductRepository productRepository;
	private UserService userService;
	private CategoryRepository categoryRepository;
	private com.zosh.repository.CartItemRepository cartItemRepository;
	private com.zosh.repository.OrderItemRepository orderItemRepository;
	private com.zosh.repository.WishlistItemRepository wishlistItemRepository;
	
	public ProductServiceImplementation(
			ProductRepository productRepository,
			UserService userService,
			CategoryRepository categoryRepository,
			com.zosh.repository.CartItemRepository cartItemRepository,
			com.zosh.repository.OrderItemRepository orderItemRepository,
			com.zosh.repository.WishlistItemRepository wishlistItemRepository) {
		this.productRepository=productRepository;
		this.userService=userService;
		this.categoryRepository=categoryRepository;
		this.cartItemRepository = cartItemRepository;
		this.orderItemRepository = orderItemRepository;
		this.wishlistItemRepository = wishlistItemRepository;
	}
	

	@Override
	public Product createProduct(CreateProductRequest req) {
		
		Category topLevel=categoryRepository.findByName(req.getTopLavelCategory());
		
		if(topLevel==null) {
			
			Category topLavelCategory=new Category();
			topLavelCategory.setName(req.getTopLavelCategory());
			topLavelCategory.setLevel(1);
			
			topLevel= categoryRepository.save(topLavelCategory);
		}
		
		Category secondLevel=categoryRepository.
				findByNameAndParentId(req.getSecondLavelCategory(),topLevel.getId());
		if(secondLevel==null) {
			
			Category secondLavelCategory=new Category();
			secondLavelCategory.setName(req.getSecondLavelCategory());
			secondLavelCategory.setParentCategory(topLevel);
			secondLavelCategory.setLevel(2);
			
			secondLevel= categoryRepository.save(secondLavelCategory);
		}

		Category thirdLevel=categoryRepository.findByNameAndParentId(req.getThirdLavelCategory(),secondLevel.getId());
		if(thirdLevel==null) {
			
			Category thirdLavelCategory=new Category();
			thirdLavelCategory.setName(req.getThirdLavelCategory());
			thirdLavelCategory.setParentCategory(secondLevel);
			thirdLavelCategory.setLevel(3);
			
			thirdLevel=categoryRepository.save(thirdLavelCategory);
		}
		
		
		Product product=new Product();
		product.setTitle(req.getTitle());
		product.setColor(req.getColor());
		product.setDescription(req.getDescription());
		product.setDiscountedPrice(req.getDiscountedPrice());
		product.setDiscountPersent(req.getDiscountPersent());
		product.setImageUrl(req.getImageUrl());
		product.setImages(req.getImages());
		product.setBrand(req.getBrand());
		product.setPrice(req.getPrice());
		product.setSizes(req.getSize());
		product.setQuantity(req.getQuantity());
		product.setCategory(thirdLevel);
		product.setCreatedAt(LocalDateTime.now());
		
		Product savedProduct= productRepository.save(product);
		
		System.out.println("products - "+product);
		
		return savedProduct;
	}

	@Override
	public String deleteProduct(Long productId) throws ProductException {
		
		Product product=findProductById(productId);
		
		System.out.println("delete product "+product.getId()+" - "+productId);
		product.getSizes().clear();
		
		// Delete dependent cart items
		List<com.zosh.modal.CartItem> cartItems = cartItemRepository.findByProduct(product);
		cartItemRepository.deleteAll(cartItems);
		
		// Delete dependent order items
		List<com.zosh.modal.OrderItem> orderItems = orderItemRepository.findByProduct(product);
		orderItemRepository.deleteAll(orderItems);

		// Delete dependent wishlist items
		List<com.zosh.modal.WishlistItem> wishlistItems = wishlistItemRepository.findByProduct(product);
		wishlistItemRepository.deleteAll(wishlistItems);
		
		productRepository.delete(product);
		
		return "Product deleted Successfully";
	}

	@Override
	public Product updateProduct(Long productId,Product req) throws ProductException {
		Product product=findProductById(productId);
		
		if(req.getQuantity()!=0) {
			product.setQuantity(req.getQuantity());
		}
		if(req.getDescription()!=null) {
			product.setDescription(req.getDescription());
		}
		
		
			
		
		return productRepository.save(product);
	}

	@Override
	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	@Override
	public Product findProductById(Long id) throws ProductException {
		Optional<Product> opt=productRepository.findById(id);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new ProductException("product not found with id "+id);
	}

	@Override
	public List<Product> findProductByCategory(String category) {
		
		System.out.println("category --- "+category);
		
		List<Product> products = productRepository.findByCategory(category);
		
		return products;
	}

	private String getTopLevelCategoryName(Product product) {
		if (product == null) return null;
		Category c = product.getCategory();
		if (c == null) return null;
		while (c.getParentCategory() != null) {
			c = c.getParentCategory();
		}
		return c.getName();
	}

	private String normalizeQuery(String query) {
		if (query == null) return "";
		String q = query.trim().toLowerCase();
		// Handle sneakers typo
		if (q.contains("sneker") || q.contains("snek")) {
			return "sneaker";
		}
		// Handle dress / dresses
		if (q.equals("dresses") || q.equals("dress")) {
			return "dress";
		}
		// Handle shirts / shirt
		if (q.equals("shirts")) {
			return "shirt";
		}
		// Handle t-shirts / tshirt / tshirts / t shirt / t shirts
		if (q.contains("tshirt") || q.contains("t-shirt") || q.contains("t shirt")) {
			return "t-shirt";
		}
		// General plural to singular for 's' ending (e.g. belts -> belt, bags -> bag, wallets -> wallet, watches -> watch)
		if (q.endsWith("s") && q.length() > 3) {
			return q.substring(0, q.length() - 1);
		}
		return q;
	}

	@Override
	public List<Product> searchProduct(String query) {
		return findProductsBySearchQuery(query);
	}

	@Override
	public Page<Product> searchProducts(String query, List<String> colors, List<String> sizes,
			Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock,
			Integer pageNumber, Integer pageSize) {
		List<Product> products = findProductsBySearchQuery(query);
		products = applyProductFilters(products, colors, sizes, minPrice, maxPrice, minDiscount, sort, stock);
		return paginateProducts(products, pageNumber, pageSize);
	}

	@Override
	public ProductFiltersResponse getSearchProductFilters(String query) {
		List<Product> products = findProductsBySearchQuery(query);
		return buildFiltersFromProducts(products, null, null);
	}

	private List<Product> findProductsBySearchQuery(String query) {
		if (query == null || query.trim().isEmpty()) {
			return java.util.Collections.emptyList();
		}

		String queryLower = query.toLowerCase().trim();
		String targetDemographic = null; // can be "men", "women", "kids"
		String searchKeyword = queryLower;

		// Parse demographic from query
		if (queryLower.startsWith("men ") || queryLower.startsWith("mens ")) {
			targetDemographic = "men";
			searchKeyword = queryLower.substring(queryLower.indexOf(" ") + 1).trim();
		} else if (queryLower.startsWith("women ") || queryLower.startsWith("womens ") || queryLower.startsWith("woman ")) {
			targetDemographic = "women";
			searchKeyword = queryLower.substring(queryLower.indexOf(" ") + 1).trim();
		} else if (queryLower.startsWith("kid ") || queryLower.startsWith("kids ") || queryLower.startsWith("boy ") || queryLower.startsWith("boys ") || queryLower.startsWith("girl ") || queryLower.startsWith("girls ")) {
			targetDemographic = "kids";
			searchKeyword = queryLower.substring(queryLower.indexOf(" ") + 1).trim();
		} else if (queryLower.endsWith(" men") || queryLower.endsWith(" mens")) {
			targetDemographic = "men";
			searchKeyword = queryLower.substring(0, queryLower.lastIndexOf(" men")).trim();
		} else if (queryLower.endsWith(" women") || queryLower.endsWith(" womens") || queryLower.endsWith(" woman")) {
			targetDemographic = "women";
			searchKeyword = queryLower.substring(0, queryLower.lastIndexOf(" women")).trim();
		} else if (queryLower.endsWith(" kid") || queryLower.endsWith(" kids") || queryLower.endsWith(" boy") || queryLower.endsWith(" boys") || queryLower.endsWith(" girl") || queryLower.endsWith(" girls")) {
			targetDemographic = "kids";
			searchKeyword = queryLower.substring(0, queryLower.lastIndexOf(" ")).trim();
		}

		// Normalize the search keyword (remove plurals, typos)
		String normalizedKeyword = normalizeQuery(searchKeyword);
		System.out.println("Search: query='" + query + "', demographic='" + targetDemographic + "', keyword='" + normalizedKeyword + "'");

		// Get products matching keyword
		List<Product> products = productRepository.searchProduct(normalizedKeyword);

		// Fallback: if nothing matches normalizedKeyword, try matching searchKeyword
		if (products.isEmpty() && !normalizedKeyword.equalsIgnoreCase(searchKeyword)) {
			products = productRepository.searchProduct(searchKeyword);
		}

		// Fallback: check all products if list is empty
		if (products.isEmpty()) {
			List<Product> allProducts = productRepository.findAll();
			products = allProducts.stream()
				.filter(p -> p.getTitle().toLowerCase().contains(normalizedKeyword) || 
				             p.getDescription().toLowerCase().contains(normalizedKeyword) ||
				             (p.getCategory() != null && p.getCategory().getName().toLowerCase().contains(normalizedKeyword)))
				.collect(Collectors.toList());
		}

		// Apply demographic filter if specified
		if (targetDemographic != null) {
			final String finalDemo = targetDemographic;
			products = products.stream()
				.filter(p -> {
					String topCat = getTopLevelCategoryName(p);
					return topCat != null && topCat.equalsIgnoreCase(finalDemo);
				})
				.collect(Collectors.toList());
		}

		return products;
	}

	private List<Product> applyProductFilters(List<Product> products, List<String> colors, List<String> sizes,
			Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock) {
		if (minPrice == null || maxPrice == null || (minPrice == 0 && maxPrice == 0)) {
			minPrice = 0;
			maxPrice = 1000000;
		}

		final int resolvedMinPrice = minPrice;
		final int resolvedMaxPrice = maxPrice;
		products = products.stream()
				.filter(product -> product.getDiscountedPrice() >= resolvedMinPrice
						&& product.getDiscountedPrice() <= resolvedMaxPrice)
				.collect(Collectors.toList());

		if (minDiscount != null && minDiscount > 0) {
			products = products.stream()
					.filter(product -> product.getDiscountPersent() >= minDiscount)
					.collect(Collectors.toList());
		}

		if (colors != null && colors.size() > 0 && colors.get(0) != null && !colors.get(0).isEmpty()) {
			products = products.stream()
					.filter(product -> colors.stream().anyMatch(color -> color.equalsIgnoreCase(product.getColor())))
					.collect(Collectors.toList());
		}

		if (sizes != null && sizes.size() > 0 && sizes.get(0) != null && !sizes.get(0).isEmpty()) {
			products = products.stream()
					.filter(product -> sizes.stream().anyMatch(selectedSize ->
							product.getSizes() != null && product.getSizes().stream()
									.anyMatch(size -> size.getQuantity() > 0
											&& selectedSize.equalsIgnoreCase(size.getName()))))
					.collect(Collectors.toList());
		}

		if (stock != null) {
			if (stock.equals("in_stock")) {
				products = products.stream().filter(product -> product.getQuantity() > 0).collect(Collectors.toList());
			} else if (stock.equals("out_of_stock")) {
				products = products.stream().filter(product -> product.getQuantity() < 1).collect(Collectors.toList());
			}
		}

		if ("price_high".equals(sort)) {
			products = products.stream()
					.sorted(Comparator.comparingInt(Product::getDiscountedPrice).reversed())
					.collect(Collectors.toList());
		} else {
			products = products.stream()
					.sorted(Comparator.comparingInt(Product::getDiscountedPrice))
					.collect(Collectors.toList());
		}

		return products;
	}

	private Page<Product> paginateProducts(List<Product> products, Integer pageNumber, Integer pageSize) {
		Pageable pageable = PageRequest.of(pageNumber, pageSize);
		int startIndex = (int) pageable.getOffset();
		if (startIndex >= products.size()) {
			return new PageImpl<>(List.of(), pageable, products.size());
		}
		int endIndex = Math.min(startIndex + pageable.getPageSize(), products.size());
		return new PageImpl<>(products.subList(startIndex, endIndex), pageable, products.size());
	}

	private ProductFiltersResponse buildFiltersFromProducts(List<Product> products, String category, String lavelOne) {
		Set<String> colors = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
		Set<String> sizes = new LinkedHashSet<>();
		int minPrice = Integer.MAX_VALUE;
		int maxPrice = 0;

		for (Product product : products) {
			if (product.getColor() != null && !product.getColor().isBlank()) {
				colors.add(product.getColor());
			}
			if (product.getDiscountedPrice() < minPrice) {
				minPrice = product.getDiscountedPrice();
			}
			if (product.getDiscountedPrice() > maxPrice) {
				maxPrice = product.getDiscountedPrice();
			}
			if (product.getSizes() != null) {
				for (Size size : product.getSizes()) {
					if (size.getName() != null && !size.getName().isBlank()
							&& (size.getQuantity() > 0 || product.getQuantity() > 0)) {
						sizes.add(size.getName());
					}
				}
			}
		}

		List<String> sizeList = new ArrayList<>(sizes);
		String sizeType;
		if (category != null && !category.isBlank()) {
			sizeType = SizeFilterHelper.detectSizeType(category);
			if (sizeList.isEmpty()) {
				sizeList = new ArrayList<>(SizeFilterHelper.getDefaultSizesForCategory(category, lavelOne));
			}
			sizeList = SizeFilterHelper.sortSizes(sizeList, sizeType);
		} else {
			sizeType = "MIXED";
			sizeList = SizeFilterHelper.sortMixedSizes(sizeList);
		}

		if (minPrice == Integer.MAX_VALUE) {
			minPrice = 0;
		}
		if (maxPrice == 0) {
			maxPrice = 100000;
		}

		return new ProductFiltersResponse(new ArrayList<>(colors), sizeList, sizeType, minPrice, maxPrice);
	}



	
	
	@Override
	public Page<Product> getAllProduct(String category, List<String>colors, 
			List<String> sizes, Integer minPrice, Integer maxPrice, 
			Integer minDiscount,String sort, String stock, Integer pageNumber, Integer pageSize, String lavelOne) {
		
		if (minPrice == 0 && maxPrice == 0) {
			minPrice = 0;
			maxPrice = 1000000;
		}
		
		List<Product> products = findProductsForCategory(category, lavelOne, minPrice, maxPrice, minDiscount, sort);
		
		products = applyProductFilters(products, colors, sizes, minPrice, maxPrice, minDiscount, sort, stock);
		return paginateProducts(products, pageNumber, pageSize);
	}

	@Override
	public ProductFiltersResponse getProductFilters(String category, String lavelOne) {
		List<Product> products = findProductsForCategory(category, lavelOne, 0, 1000000, 0, "price_low");
		return buildFiltersFromProducts(products, category, lavelOne);
	}

	private List<Product> findProductsForCategory(String category, String lavelOne, Integer minPrice,
			Integer maxPrice, Integer minDiscount, String sort) {
		List<Product> products = productRepository.filterProducts(category, minPrice, maxPrice, minDiscount, sort);

		if (lavelOne != null && !lavelOne.trim().isEmpty()) {
			products = products.stream()
			        .filter(p -> {
			            Category categoryNode = p.getCategory();
			            while (categoryNode != null && categoryNode.getParentCategory() != null) {
			                categoryNode = categoryNode.getParentCategory();
			            }
			            return categoryNode != null && categoryNode.getName().equalsIgnoreCase(lavelOne.trim());
			        })
			        .collect(Collectors.toList());
		}

		return products;
	}


	@Override
	public List<Product> recentlyAddedProduct() {
		
		return productRepository.findTop10ByOrderByCreatedAtDesc();
	}

}
