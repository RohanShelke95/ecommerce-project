package com.zosh.config;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.zosh.modal.Category;
import com.zosh.modal.Product;
import com.zosh.repository.AppMetadataRepository;
import com.zosh.repository.CategoryRepository;
import com.zosh.repository.ProductRepository;
import com.zosh.modal.AppMetadata;
import com.zosh.modal.Size;
import com.zosh.util.SizeFilterHelper;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final String INITIAL_SEED_KEY = "SEED_V3_10_PRODUCTS_PER_CATEGORY";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final AppMetadataRepository appMetadataRepository;

    public DatabaseSeeder(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            AppMetadataRepository appMetadataRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.appMetadataRepository = appMetadataRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Starting Comprehensive Database Check & Seeding...");

        repairMissingProductSizes();

        if (appMetadataRepository.findByMetaKey(INITIAL_SEED_KEY).isEmpty()) {
            seedDemoProducts();
            markInitialSeedCompleted();
            System.out.println("Demo products (10 per category) inserted successfully.");
        } else {
            System.out.println("Demo products already seeded for SEED_V3. Skipping...");
        }

        System.out.println("Database Check Completed.");
    }

    private void seedDemoProducts() {
        System.out.println("Ensuring categories and seeding 10 products per category...");

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

        // ================= SEEDING PRODUCTS (10 PER CATEGORY) =================
        String[] clothingSizes = new String[] { "S", "M", "L", "XL", "XXL" };
        String[] shoeSizes = new String[] { "6", "7", "8", "9", "10", "11" };
        String[] freeSize = new String[] { "Free Size" };
        String[] waistSizes = new String[] { "28", "30", "32", "34", "36" };

        // --- 1. Women Dresses ---
        seedCategoryProducts("Women Floral Chiffon Maxi Dress", "Zara", "Pink", 3999, 2499, "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80", womenDresses, clothingSizes);
        seedCategoryProducts("A-Line Velvet Evening Dress", "H&M", "Black", 4999, 3299, "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80", womenDresses, clothingSizes);
        seedCategoryProducts("Summer Casual Cotton Sundress", "ONLY", "Blue", 2999, 1899, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80", womenDresses, clothingSizes);
        seedCategoryProducts("Elegant Satin Slip Dress", "Mango", "Red", 3499, 2299, "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80", womenDresses, clothingSizes);
        seedCategoryProducts("Boho Tiered Printed Midi Dress", "Vero Moda", "Yellow", 3299, 1999, "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80", womenDresses, clothingSizes);

        // --- 2. Women Tops ---
        seedCategoryProducts("Women White Cotton Ruffle Top", "Forever 21", "White", 1999, 1199, "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80", womenTops, clothingSizes);
        seedCategoryProducts("Silk Crop Top Satin Blouse", "Zara", "Emerald", 2499, 1499, "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80", womenTops, clothingSizes);
        seedCategoryProducts("Floral Printed Summer Blouse Top", "H&M", "Multicolor", 1799, 999, "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=600&q=80", womenTops, clothingSizes);

        // --- 3. Women Jeans ---
        seedCategoryProducts("Women High Rise Skinny Blue Jeans", "Levis", "Blue", 3499, 2299, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80", womenJeansCat, waistSizes);
        seedCategoryProducts("Wide Leg Vintage Black Denim", "H&M", "Black", 3999, 2599, "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80", womenJeansCat, waistSizes);
        seedCategoryProducts("Distressed Boyfriend Light Blue Jeans", "Zara", "Light Blue", 3799, 2399, "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80", womenJeansCat, waistSizes);

        // --- 4. Sarees ---
        seedCategoryProducts("Kanjivaram Pure Silk Red Saree", "Kalyan Silks", "Red", 9999, 6999, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", sareeCat, freeSize);
        seedCategoryProducts("Cotton Handloom Chanderi Saree", "FabIndia", "Yellow", 3599, 2499, "https://images.unsplash.com/photo-1583391733958-d25e07fac662?w=600&q=80", sareeCat, freeSize);
        seedCategoryProducts("Banarasi Zari Woven Silk Saree", "Kalapushpi", "Maroon", 7999, 4999, "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=600&q=80", sareeCat, freeSize);

        // --- 5. Lengha Choli ---
        seedCategoryProducts("Designer Embroidered Velvet Lehenga", "Biba", "Maroon", 14999, 9999, "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80", lenghaCholi, freeSize);
        seedCategoryProducts("Floral Printed Silk Lehenga Choli", "Global Desi", "Pink", 11999, 7999, "https://images.unsplash.com/photo-1583391733958-d25e07fac662?w=600&q=80", lenghaCholi, freeSize);

        // --- 6. Men Kurtas ---
        seedCategoryProducts("Men Pure Cotton Printed Kurta", "Majestic Man", "Green", 1999, 899, "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80", mensKurtaCat, clothingSizes);
        seedCategoryProducts("Men Embroidered Silk Festive Kurta", "Manyavar", "Yellow", 3999, 2499, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80", mensKurtaCat, clothingSizes);
        seedCategoryProducts("Royal Blue Jacquard Kurta Pajama", "SG LEMAN", "Blue", 3499, 1999, "https://images.unsplash.com/photo-1583391733958-d25e07fac662?w=600&q=80", mensKurtaCat, clothingSizes);

        // --- 7. Men Shirts ---
        seedCategoryProducts("Men Slim Fit Formal White Shirt", "Peter England", "White", 2499, 1499, "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", menShirt, clothingSizes);
        seedCategoryProducts("Men Casual Denim Shirt Blue", "Levis", "Blue", 2999, 1899, "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", menShirt, clothingSizes);
        seedCategoryProducts("Men Printed Linen Beach Shirt", "Zara", "Beige", 2799, 1699, "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80", menShirt, clothingSizes);

        // --- 8. Men Jeans ---
        seedCategoryProducts("Men Slim Fit Blue Stretch Denim", "Levis", "Blue", 3999, 2499, "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", menJeansCat, waistSizes);
        seedCategoryProducts("Men Regular Fit Dark Black Jeans", "Wrangler", "Black", 3499, 2199, "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80", menJeansCat, waistSizes);
        seedCategoryProducts("Men Tapered Grey Faded Jeans", "Pepe Jeans", "Grey", 3299, 1999, "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80", menJeansCat, waistSizes);

        // --- 9. Men & Women Shoes ---
        seedCategoryProducts("Men Leather Formal Oxfords", "Louis Philippe", "Black", 6999, 4499, "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80", menOxfords, shoeSizes);
        seedCategoryProducts("Men Suede Penny Loafers Brown", "Hush Puppies", "Brown", 5499, 3499, "https://images.unsplash.com/photo-1559544498-8547b7aa44d9?w=600&q=80", menLoafers, shoeSizes);
        seedCategoryProducts("Men White Retro Sneakers", "Puma", "White", 4999, 2999, "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80", menSneakers, shoeSizes);
        seedCategoryProducts("Men Robust Hiking Leather Boots", "Woodland", "Camel", 7999, 5299, "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80", menBoots, shoeSizes);

        seedCategoryProducts("Women Classic Stiletto Red Heels", "Catwalk", "Red", 3999, 2499, "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", womenHeels, shoeSizes);
        seedCategoryProducts("Women Casual Leather Ballet Flats", "Inc.5", "Pink", 2499, 1599, "https://images.unsplash.com/photo-1579549301053-912b9d997d6f?w=600&q=80", womenFlats, shoeSizes);
        seedCategoryProducts("Women Sporty Chunky White Sneakers", "Nike", "White", 5999, 3999, "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80", womenSneakers, shoeSizes);
        seedCategoryProducts("Women Stylish Black Ankle Boots", "Carlton London", "Black", 4999, 3199, "https://images.unsplash.com/photo-1591871987515-37351664e43e?w=600&q=80", womenBoots, shoeSizes);

        // --- 10. Accessories & Kids ---
        seedCategoryProducts("Luxury Chronograph Analog Watch", "Fossil", "Silver", 9999, 6499, "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80", menWatches, freeSize);
        seedCategoryProducts("Women Rose Gold Slim Mesh Watch", "Titan", "Rose Gold", 7999, 4999, "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80", womenWatches, freeSize);
        seedCategoryProducts("Genuine Bifold Leather Wallet", "Tommy Hilfiger", "Brown", 2999, 1799, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", menWallets, freeSize);
        seedCategoryProducts("Women Designer Shoulder Tote Bag", "Michael Kors", "Black", 8999, 5999, "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", womenBags, freeSize);
        seedCategoryProducts("Classic Polarized Wayfarer Sunglasses", "Ray-Ban", "Black", 5499, 3999, "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", menSunglasses, freeSize);

        seedCategoryProducts("Boys Printed Cotton T-Shirt", "Mothercare", "Blue", 999, 599, "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80", kidsTShirts, clothingSizes);
        seedCategoryProducts("Kids Lightweight Running Sneakers", "Puma Kids", "Red", 2499, 1499, "https://images.unsplash.com/photo-1514989940723-e8e51635b702?w=600&q=80", kidsSneakers, shoeSizes);
        seedCategoryProducts("Kids Black Leather School Shoes", "Bata", "Black", 1499, 999, "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80", kidsSchoolShoes, shoeSizes);
    }

    private void seedCategoryProducts(String baseTitle, String brand, String color, int price, int discountedPrice, String imageUrl, Category category, String[] sizeNames) {
        int discountPercent = (int) Math.round(((double) (price - discountedPrice) / price) * 100);
        for (int i = 1; i <= 10; i++) {
            String title = baseTitle + " Vol." + i;
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
