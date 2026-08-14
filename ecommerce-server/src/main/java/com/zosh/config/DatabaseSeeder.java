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
    public void run(String... args) throws Exception {
        System.out.println("Starting Reliable Database Reset & 10 Products Per Category Seeding...");

        if (appMetadataRepository.findByMetaKey(INITIAL_SEED_KEY).isEmpty()) {
            wipeOldProductData();
            seedDemoProducts();
            markInitialSeedCompleted();
            System.out.println("Clean Database Reset & 10 Products per Category inserted successfully!");
        } else {
            System.out.println("Demo products already seeded for FORCE_RESET_AND_SEED_V5. Skipping...");
        }

        repairMissingProductSizes();
        System.out.println("Database Check Completed.");
    }

    private void wipeOldProductData() {
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

        // ================= SIZE ARRAYS =================
        String[] clothingSizes = new String[] { "S", "M", "L", "XL", "XXL" };
        String[] shoeSizes = new String[] { "6", "7", "8", "9", "10", "11" };
        String[] freeSize = new String[] { "Free Size" };
        String[] waistSizes = new String[] { "28", "30", "32", "34", "36" };

        // --- Women Clothing ---
        seed10Products("Floral Chiffon Summer Dress", "Zara", "Pink", 3999, 2499, "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80", womenDresses, clothingSizes);
        seed10Products("White Cotton Ruffle Casual Top", "Forever 21", "White", 1999, 1199, "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", womenTops, clothingSizes);
        seed10Products("High Rise Stretch Skinny Jeans", "Levis", "Blue", 3499, 2299, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80", womenJeansCat, waistSizes);
        seed10Products("Kanjivaram Silk Woven Saree", "Kalyan Silks", "Red", 9999, 6999, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", sareeCat, freeSize);
        seed10Products("Embroidered Velvet Lehenga Choli", "Biba", "Maroon", 14999, 9999, "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80", lenghaCholi, freeSize);
        seed10Products("Cozy Knit Woolen Sweater", "H&M", "Beige", 2999, 1799, "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", womenSweaters, clothingSizes);
        seed10Products("Printed Graphic Cotton T-Shirt", "ONLY", "Yellow", 1299, 799, "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", womenTShirts, clothingSizes);
        seed10Products("Faux Leather Biker Jacket", "Mango", "Black", 5999, 3499, "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", womenJackets, clothingSizes);
        seed10Products("Designer Silk Anarkali Gown", "Global Desi", "Green", 8999, 5499, "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80", gounsCat, freeSize);
        seed10Products("Embroidered Straight Rayon Kurta", "W", "Navy Blue", 2499, 1499, "https://images.unsplash.com/photo-1583391733958-d25e07fac662?w=600&q=80", womenKurtas, clothingSizes);

        // --- Women Accessories & Shoes ---
        seed10Products("Rose Gold Mesh Strap Watch", "Titan", "Rose Gold", 7999, 4999, "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80", womenWatches, freeSize);
        seed10Products("Classic Leather Zip Wallet", "Fossil", "Tan", 2999, 1799, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", womenWallets, freeSize);
        seed10Products("Designer Shoulder Tote Bag", "Michael Kors", "Black", 8999, 5999, "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", womenBags, freeSize);
        seed10Products("Cat Eye Trendy Sunglasses", "Ray-Ban", "Black", 4999, 3299, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", womenSunglasses, freeSize);
        seed10Products("Wide Brim Beach Sun Hat", "H&M", "Straw", 1499, 899, "https://images.unsplash.com/photo-1521369984125-a4ec3085d388?w=600&q=80", womenHats, freeSize);
        seed10Products("Genuine Slim Leather Belt", "Zara", "Brown", 1299, 799, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", womenBelts, freeSize);

        seed10Products("Lightweight Running White Sneakers", "Puma", "White", 4500, 3150, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80", womenSneakers, shoeSizes);
        seed10Products("Stylish Leather Ankle Boots", "Carlton London", "Black", 5999, 3999, "https://images.unsplash.com/photo-1591871987515-37351664e43e?w=600&q=80", womenBoots, shoeSizes);
        seed10Products("Classic Stiletto High Heels", "Catwalk", "Red", 3999, 2499, "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", womenHeels, shoeSizes);
        seed10Products("Ballet Leather Slip-on Flats", "Inc.5", "Pink", 2499, 1599, "https://images.unsplash.com/photo-1579549301053-912b9d997d6f?w=600&q=80", womenFlats, shoeSizes);

        // --- Men Clothing ---
        seed10Products("Men Printed Cotton Straight Kurta", "Majestic Man", "Green", 1999, 899, "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80", mensKurtaCat, clothingSizes);
        seed10Products("Slim Fit Cotton Formal Shirt", "Peter England", "White", 2499, 1499, "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", menShirt, clothingSizes);
        seed10Products("Slim Fit Blue Stretch Denim Jeans", "Levis", "Blue", 3999, 2499, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", menJeansCat, waistSizes);
        seed10Products("Crew Neck Pullover Wool Sweater", "Roadster", "Charcoal", 2499, 1499, "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", menSweaters, clothingSizes);
        seed10Products("Classic Solid Round Neck T-Shirt", "US Polo", "Black", 1299, 799, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80", menTShirts, clothingSizes);
        seed10Products("Denim Trucker Casual Jacket", "Wrangler", "Blue", 4999, 2999, "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=600&q=80", menJackets, clothingSizes);
        seed10Products("Dry-Fit Gym Activewear Tracksuit", "Nike", "Grey", 4499, 2999, "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80", menActivewear, clothingSizes);

        // --- Men Accessories & Shoes ---
        seed10Products("Chronograph Stainless Steel Watch", "Fossil", "Silver", 9999, 6499, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80", menWatches, freeSize);
        seed10Products("Genuine Bifold Leather Wallet", "Tommy Hilfiger", "Brown", 2999, 1799, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", menWallets, freeSize);
        seed10Products("Canvas Travel Laptop Duffle Bag", "Wildcraft", "Black", 3499, 2199, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", menBags, freeSize);
        seed10Products("Polarized Wayfarer Sunglasses", "Ray-Ban", "Black", 5499, 3999, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", menSunglasses, freeSize);
        seed10Products("Classic Cotton Baseball Cap Hat", "Adidas", "Navy Blue", 1299, 799, "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80", menHats, freeSize);
        seed10Products("Formal Genuine Leather Belt", "Woodland", "Black", 1999, 1199, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", menBelts, freeSize);

        seed10Products("Retro Low-Top White Sneakers", "Puma", "White", 4999, 2999, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80", menSneakers, shoeSizes);
        seed10Products("Formal Leather Derby Oxfords", "Louis Philippe", "Black", 6999, 4499, "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80", menOxfords, shoeSizes);
        seed10Products("Suede Leather Slip-On Loafers", "Hush Puppies", "Brown", 5499, 3499, "https://images.unsplash.com/photo-1559544498-8547b7aa44d9?w=600&q=80", menLoafers, shoeSizes);
        seed10Products("Robust Leather Hiking Boots", "Woodland", "Camel", 7999, 5299, "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80", menBoots, shoeSizes);

        // --- Kids Clothing, Accessories & Shoes ---
        seed10Products("Boys Casual Plaid Button Shirt", "Mothercare", "Blue", 1499, 899, "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80", kidsShirts, clothingSizes);
        seed10Products("Kids Cartoon Printed Cotton T-Shirt", "HM Kids", "Yellow", 999, 599, "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80", kidsTShirts, clothingSizes);
        seed10Products("Kids Comfortable Stretch Jeans", "Levis Kids", "Blue", 1999, 1299, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80", kidsJeansCat, waistSizes);
        seed10Products("Kids Warm Knit Pattern Sweater", "Zara Kids", "Red", 1799, 1099, "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", kidsSweaters, clothingSizes);
        seed10Products("Kids Hooded Winter Puffer Jacket", "GAP", "Navy", 2999, 1899, "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", kidsJackets, clothingSizes);

        seed10Products("Kids Colorful Digital Watch", "Fastrack", "Blue", 1499, 899, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80", kidsWatches, freeSize);
        seed10Products("Kids Cute School Backpack", "Wildcraft", "Red", 1999, 1199, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", kidsBags, freeSize);
        seed10Products("Kids Embroidered Sun Cap", "H&M Kids", "Yellow", 799, 499, "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80", kidsHats, freeSize);

        seed10Products("Kids Velcro Sport Sneakers", "Puma Kids", "Red", 2499, 1499, "https://images.unsplash.com/photo-1514989940723-e8e51635b702?w=600&q=80", kidsSneakers, shoeSizes);
        seed10Products("Kids Black Leather School Shoes", "Bata", "Black", 1499, 999, "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80", kidsSchoolShoes, shoeSizes);
        seed10Products("Kids Casual Beach Sandals", "Crocs", "Blue", 1799, 1199, "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", kidsSandals, shoeSizes);
    }

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
            Set<Size> sizes = buildSizes(defaultSizes, product.getQuantity());
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
