package com.zosh.config;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.zosh.modal.Category;
import com.zosh.modal.Product;
import com.zosh.modal.AppMetadata;
import com.zosh.modal.Size;

import com.zosh.repository.AppMetadataRepository;
import com.zosh.repository.CategoryRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.OrderItemRepository;
import com.zosh.repository.WishlistItemRepository;
import com.zosh.repository.RatingRepository;
import com.zosh.repository.ReviewRepository;

import com.zosh.util.SizeFilterHelper;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final String INITIAL_SEED_KEY = "FORCE_RESET_AND_SEED_V5";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AppMetadataRepository appMetadataRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final RatingRepository ratingRepository;
    private final ReviewRepository reviewRepository;

    public DatabaseSeeder(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            AppMetadataRepository appMetadataRepository,
            CartItemRepository cartItemRepository,
            OrderItemRepository orderItemRepository,
            WishlistItemRepository wishlistItemRepository,
            RatingRepository ratingRepository,
            ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.appMetadataRepository = appMetadataRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.ratingRepository = ratingRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("Database Seeding is disabled. Starting with empty products table.");
    }

    public void wipeOldProductData() {
        System.out.println("Wiping existing product data in safe foreign-key order...");

        try { cartItemRepository.deleteAll(); } catch (Exception e) { System.err.println("CartItem wipe warning: " + e.getMessage()); }
        try { wishlistItemRepository.deleteAll(); } catch (Exception e) { System.err.println("WishlistItem wipe warning: " + e.getMessage()); }
        try { ratingRepository.deleteAll(); } catch (Exception e) { System.err.println("Rating wipe warning: " + e.getMessage()); }
        try { reviewRepository.deleteAll(); } catch (Exception e) { System.err.println("Review wipe warning: " + e.getMessage()); }
        try { orderItemRepository.deleteAll(); } catch (Exception e) { System.err.println("OrderItem wipe warning: " + e.getMessage()); }
        try { productRepository.deleteAll(); } catch (Exception e) { System.err.println("Product wipe warning: " + e.getMessage()); }

        // Safely delete categories level by level (Level 3 -> Level 2 -> Level 1) to prevent FK crashes
        try {
            List<Category> allCategories = categoryRepository.findAll();
            List<Category> level3 = allCategories.stream().filter(c -> c.getLevel() == 3).toList();
            List<Category> level2 = allCategories.stream().filter(c -> c.getLevel() == 2).toList();
            List<Category> level1 = allCategories.stream().filter(c -> c.getLevel() == 1).toList();

            categoryRepository.deleteAll(level3);
            categoryRepository.deleteAll(level2);
            categoryRepository.deleteAll(level1);
            categoryRepository.deleteAll(); // clear remaining if any
            System.out.println("Categories wiped level-by-level cleanly.");
        } catch (Exception e) {
            System.err.println("Category wipe warning: " + e.getMessage());
        }
    }
    public void wipeProductsOnly() {
        System.out.println("Wiping products only (keeping categories, users, and metadata)...");
        try { cartItemRepository.deleteAll(); } catch (Exception e) { System.err.println("CartItem wipe warning: " + e.getMessage()); }
        try { wishlistItemRepository.deleteAll(); } catch (Exception e) { System.err.println("WishlistItem wipe warning: " + e.getMessage()); }
        try { ratingRepository.deleteAll(); } catch (Exception e) { System.err.println("Rating wipe warning: " + e.getMessage()); }
        try { reviewRepository.deleteAll(); } catch (Exception e) { System.err.println("Review wipe warning: " + e.getMessage()); }
        try { orderItemRepository.deleteAll(); } catch (Exception e) { System.err.println("OrderItem wipe warning: " + e.getMessage()); }
        try { productRepository.deleteAll(); } catch (Exception e) { System.err.println("Product wipe warning: " + e.getMessage()); }
    }

    private void seedDemoProducts() {
        System.out.println("Creating level 1, 2, 3 categories and seeding 10 products per category...");

        // ================= LEVEL 1 CATEGORIES =================
        Category womenLevel = getOrCreateLevel1Category("women");
        Category menLevel = getOrCreateLevel1Category("men");
        Category kidsLevel = getOrCreateLevel1Category("kids");

        // ================= LEVEL 2 CATEGORIES =================
        Category womenClothing = getOrCreateSecondLevelCategory("clothing", womenLevel);
        Category womenAccessories = getOrCreateSecondLevelCategory("accessories", womenLevel);
        Category womenShoes = getOrCreateSecondLevelCategory("shoes", womenLevel);

        Category menClothing = getOrCreateSecondLevelCategory("clothing", menLevel);
        Category menAccessories = getOrCreateSecondLevelCategory("accessories", menLevel);
        Category menShoes = getOrCreateSecondLevelCategory("shoes", menLevel);

        Category kidsClothing = getOrCreateSecondLevelCategory("clothing", kidsLevel);
        Category kidsAccessories = getOrCreateSecondLevelCategory("accessories", kidsLevel);
        Category kidsShoes = getOrCreateSecondLevelCategory("shoes", kidsLevel);

        // ================= LEVEL 3 CATEGORIES (WOMEN) =================
        Category womenTops = getOrCreateThirdLevelCategory("top", womenClothing);
        Category womenDresses = getOrCreateThirdLevelCategory("women_dress", womenClothing);
        Category womenJeansCat = getOrCreateThirdLevelCategory("women_jeans", womenClothing);
        Category lenghaCholi = getOrCreateThirdLevelCategory("lengha_choli", womenClothing);
        Category womenSweaters = getOrCreateThirdLevelCategory("sweater", womenClothing);
        Category womenTShirts = getOrCreateThirdLevelCategory("t-shirts", womenClothing);
        Category womenJackets = getOrCreateThirdLevelCategory("jacket", womenClothing);
        Category gounsCat = getOrCreateThirdLevelCategory("gouns", womenClothing);
        Category sareeCat = getOrCreateThirdLevelCategory("saree", womenClothing);
        Category womenKurtas = getOrCreateThirdLevelCategory("kurtas", womenClothing);

        Category womenWatches = getOrCreateThirdLevelCategory("watch", womenAccessories);
        Category womenWallets = getOrCreateThirdLevelCategory("wallet", womenAccessories);
        Category womenBags = getOrCreateThirdLevelCategory("bag", womenAccessories);
        Category womenSunglasses = getOrCreateThirdLevelCategory("sunglasse", womenAccessories);
        Category womenHats = getOrCreateThirdLevelCategory("hat", womenAccessories);
        Category womenBelts = getOrCreateThirdLevelCategory("belt", womenAccessories);

        Category womenSneakers = getOrCreateThirdLevelCategory("sneakers", womenShoes);
        Category womenBoots = getOrCreateThirdLevelCategory("boots", womenShoes);
        Category womenHeels = getOrCreateThirdLevelCategory("heels", womenShoes);
        Category womenFlats = getOrCreateThirdLevelCategory("flats", womenShoes);

        // ================= LEVEL 3 CATEGORIES (MEN) =================
        Category mensKurtaCat = getOrCreateThirdLevelCategory("mens_kurta", menClothing);
        Category menShirt = getOrCreateThirdLevelCategory("shirt", menClothing);
        Category menJeansCat = getOrCreateThirdLevelCategory("men_jeans", menClothing);
        Category menSweaters = getOrCreateThirdLevelCategory("sweater", menClothing);
        Category menTShirts = getOrCreateThirdLevelCategory("t-shirts", menClothing);
        Category menJackets = getOrCreateThirdLevelCategory("jacket", menClothing);
        Category menActivewear = getOrCreateThirdLevelCategory("activewear", menClothing);

        Category menWatches = getOrCreateThirdLevelCategory("watch", menAccessories);
        Category menWallets = getOrCreateThirdLevelCategory("wallet", menAccessories);
        Category menBags = getOrCreateThirdLevelCategory("bag", menAccessories);
        Category menSunglasses = getOrCreateThirdLevelCategory("sunglass", menAccessories);
        Category menHats = getOrCreateThirdLevelCategory("hat", menAccessories);
        Category menBelts = getOrCreateThirdLevelCategory("belt", menAccessories);

        Category menSneakers = getOrCreateThirdLevelCategory("sneakers", menShoes);
        Category menOxfords = getOrCreateThirdLevelCategory("oxfords", menShoes);
        Category menLoafers = getOrCreateThirdLevelCategory("loafers", menShoes);
        Category menBoots = getOrCreateThirdLevelCategory("boots", menShoes);

        // ================= LEVEL 3 CATEGORIES (KIDS) =================
        Category kidsShirts = getOrCreateThirdLevelCategory("shirt", kidsClothing);
        Category kidsTShirts = getOrCreateThirdLevelCategory("t-shirts", kidsClothing);
        Category kidsJeansCat = getOrCreateThirdLevelCategory("kids_jeans", kidsClothing);
        Category kidsSweaters = getOrCreateThirdLevelCategory("sweater", kidsClothing);
        Category kidsJackets = getOrCreateThirdLevelCategory("jacket", kidsClothing);

        Category kidsWatches = getOrCreateThirdLevelCategory("watch", kidsAccessories);
        Category kidsBags = getOrCreateThirdLevelCategory("bag", kidsAccessories);
        Category kidsHats = getOrCreateThirdLevelCategory("hat", kidsAccessories);

        Category kidsSneakers = getOrCreateThirdLevelCategory("sneakers", kidsShoes);
        Category kidsSchoolShoes = getOrCreateThirdLevelCategory("school_shoes", kidsShoes);
        Category kidsSandals = getOrCreateThirdLevelCategory("sandals", kidsShoes);
    }

    // ================= SIZE ARRAYS =================
    String[] clothingSizes = new String[] { "S", "M", "L", "XL", "XXL" };
    String[] shoeSizes = new String[] { "6", "7", "8", "9", "10", "11" };
    String[] freeSize = new String[] { "Free Size" };
    String[] waistSizes = new String[] { "28", "30", "32", "34", "36" };

    
    private void seed10Products(String baseTitle, String brand, String color, int price, int discountedPrice, String imageUrl, Category category, String[] sizeNames) {
        int discountPercent = (int) Math.round(((double) (price - discountedPrice) / price) * 100);
        for (int i = 1; i <= 10; i++) {
            String title = baseTitle + " - Edition " + i;
            createProductIfNotExist(title, brand, color, price, discountedPrice, discountPercent, imageUrl, category, sizeNames);
        }
    }

    private Category getOrCreateLevel1Category(String name) {
        Category existing = categoryRepository.findByName(name);
        if (existing != null) return existing;
        Category c = new Category();
        c.setName(name);
        c.setLevel(1);
        return categoryRepository.save(c);
    }

    private Category getOrCreateSecondLevelCategory(String name, Category parent) {
        Category existing = categoryRepository.findByNameAndParentId(name, parent.getId());
        if (existing != null) return existing;
        Category newCat = new Category();
        newCat.setName(name);
        newCat.setParentCategory(parent);
        newCat.setLevel(2);
        return categoryRepository.save(newCat);
    }

    private Category getOrCreateThirdLevelCategory(String name, Category parent) {
        List<Category> cats = categoryRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name) && c.getParentCategory() != null
                        && c.getParentCategory().getId().equals(parent.getId()))
                .toList();
        if (!cats.isEmpty()) return cats.get(0);
        Category newCat = new Category();
        newCat.setName(name);
        newCat.setParentCategory(parent);
        newCat.setLevel(3);
        return categoryRepository.save(newCat);
    }

    private void markInitialSeedCompleted() {
        if (appMetadataRepository.findByMetaKey(INITIAL_SEED_KEY).isPresent()) return;
        appMetadataRepository.save(new AppMetadata(null, INITIAL_SEED_KEY, "true"));
    }

    private void repairMissingProductSizes() {
        for (Product product : productRepository.findAll()) {
            if (product.getSizes() != null && !product.getSizes().isEmpty()) continue;
            String categoryName = product.getCategory() != null ? product.getCategory().getName() : "";
            String topLevel = getTopLevelCategoryName(product);
            List<String> defaultSizes = SizeFilterHelper.getDefaultSizesForCategory(categoryName, topLevel);
            Set<Size> sizes = buildSizes(defaultSizes.toArray(new String[0]), product.getQuantity());
            product.setSizes(sizes);
            productRepository.save(product);
        }
    }

    private String getTopLevelCategoryName(Product product) {
        Category category = product.getCategory();
        if (category == null) return "";
        while (category.getParentCategory() != null) category = category.getParentCategory();
        return category.getName();
    }

    private Set<Size> buildSizes(String[] sizeNames, int totalQuantity) {
        Set<Size> sizes = new HashSet<>();
        int perSizeQuantity = Math.max(1, totalQuantity / Math.max(sizeNames.length, 1));
        for (String sizeName : sizeNames) {
            Size size = new Size();
            size.setName(sizeName);
            size.setQuantity(perSizeQuantity);
            sizes.add(size);
        }
        return sizes;
    }

    private void createProductIfNotExist(String title, String brand, String color, int price, int discountedPrice,
            int discountPercent, String imageUrl, Category category, String[] sizeNames) {
        List<Product> existing = productRepository.findAll().stream()
                .filter(p -> p.getTitle().equalsIgnoreCase(title))
                .toList();
        if (existing.isEmpty()) {
            Product p = new Product();
            p.setTitle(title);
            p.setBrand(brand);
            p.setColor(color);
            p.setPrice(price);
            p.setDiscountedPrice(discountedPrice);
            p.setDiscountPersent(discountPercent);
            p.setQuantity(50);
            p.setImageUrl(imageUrl);
            p.setCategory(category);
            p.setSizes(buildSizes(sizeNames, 50));
            p.setCreatedAt(java.time.LocalDateTime.now());
            productRepository.save(p);
        } else {
            Product p = existing.get(0);
            boolean updated = false;
            if (p.getCategory() == null || !p.getCategory().getId().equals(category.getId())) {
                p.setCategory(category);
                updated = true;
            }
            if (p.getSizes() == null || p.getSizes().isEmpty()) {
                p.setSizes(buildSizes(sizeNames, p.getQuantity() > 0 ? p.getQuantity() : 50));
                updated = true;
            }
            if (p.getImageUrl() == null || !p.getImageUrl().equals(imageUrl)) {
                p.setImageUrl(imageUrl);
                updated = true;
            }
            if (updated) productRepository.save(p);
        }
    }
}
