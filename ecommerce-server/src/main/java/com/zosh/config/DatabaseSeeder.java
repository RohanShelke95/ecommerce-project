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

    private static final String INITIAL_SEED_KEY = "INITIAL_SEED_COMPLETED";

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

        System.out.println("Starting Database Check...");

        repairMissingProductSizes();

        if (appMetadataRepository.findByMetaKey(INITIAL_SEED_KEY).isEmpty()) {
            seedDemoProducts();
            markInitialSeedCompleted();
            System.out.println("Demo products inserted.");
        } else {
            System.out.println("Demo products already seeded. Skipping...");
        }

        System.out.println("Database Check Completed.");
    }

    private void seedDemoProducts() {
        System.out.println("Ensuring demo categories and products exist...");

        // Ensure Level 1: "men" exists
        Category menLevel = categoryRepository.findByName("men");
        if (menLevel == null) {
            Category newMen = new Category();
            newMen.setName("men");
            newMen.setLevel(1);
            menLevel = categoryRepository.save(newMen);
        }

        // Ensure Level 2: "shoes" under "men" exists
        Category menShoes = categoryRepository.findByNameAndParant("shoes", "men");
        if (menShoes == null) {
            Category newShoes = new Category();
            newShoes.setName("shoes");
            newShoes.setParentCategory(menLevel);
            newShoes.setLevel(2);
            menShoes = categoryRepository.save(newShoes);
        }

        // Ensure Men's Level 3 Categories
        Category menSneakers = getOrCreateThirdLevelCategory("sneakers", menShoes);
        Category menOxfords = getOrCreateThirdLevelCategory("oxfords", menShoes);
        Category menLoafers = getOrCreateThirdLevelCategory("loafers", menShoes);
        Category menBoots = getOrCreateThirdLevelCategory("boots", menShoes);

        // Ensure Level 1: "women" exists
        Category womenLevel = categoryRepository.findByName("women");
        if (womenLevel == null) {
            Category newWomen = new Category();
            newWomen.setName("women");
            newWomen.setLevel(1);
            womenLevel = categoryRepository.save(newWomen);
        }

        // Ensure Level 2: "shoes" under "women" exists
        Category womenShoes = categoryRepository.findByNameAndParant("shoes", "women");
        if (womenShoes == null) {
            Category newShoes = new Category();
            newShoes.setName("shoes");
            newShoes.setParentCategory(womenLevel);
            newShoes.setLevel(2);
            womenShoes = categoryRepository.save(newShoes);
        }

        // Ensure Women's Level 3 Categories
        Category womenSneakers = getOrCreateThirdLevelCategory("sneakers", womenShoes);
        Category womenBoots = getOrCreateThirdLevelCategory("boots", womenShoes);
        Category womenHeels = getOrCreateThirdLevelCategory("heels", womenShoes);
        Category womenFlats = getOrCreateThirdLevelCategory("flats", womenShoes);

        // Ensure Level 2: "clothing" under "men" and "women"
        Category menClothing = getOrCreateSecondLevelCategory("clothing", menLevel);
        Category womenClothing = getOrCreateSecondLevelCategory("clothing", womenLevel);

        // Ensure clothing Level 3 categories used by the homepage
        Category mensKurta = getOrCreateThirdLevelCategory("mens_kurta", menClothing);
        Category womenDress = getOrCreateThirdLevelCategory("women_dress", womenClothing);
        Category saree = getOrCreateThirdLevelCategory("saree", womenClothing);
        Category menJeans = getOrCreateThirdLevelCategory("men_jeans", menClothing);
        Category womenJeans = getOrCreateThirdLevelCategory("women_jeans", womenClothing);

        // Seed Men's Kurtas
        createProductIfNotExist("Men Printed Pure Cotton Straight Kurta", "Majestic Man", "Green", 1499, 499, 66,
                "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL" });
        createProductIfNotExist("Men Embroidered Jacquard Straight Kurta", "SG LEMAN", "Yellow", 2499, 799, 68,
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL" });
        createProductIfNotExist("Embroidered Cotton Kurta", "Manyavar", "Blue", 2999, 2499, 16,
                "https://images.unsplash.com/photo-1583391733958-d25e07fac662?w=600&q=80",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL", "XXXL" });
        createProductIfNotExist("White Pure Cotton Kurta", "Peter England", "White", 1299, 999, 23,
                "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL" });

        // Seed Men's Jeans
        createProductIfNotExist("Men Slim Fit Blue Jeans", "Levis", "Blue", 3999, 2799, 30,
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
                menJeans, new String[] { "28", "30", "32", "34", "36", "38" });
        createProductIfNotExist("Men Regular Fit Black Jeans", "Wrangler", "Black", 3499, 2449, 30,
                "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80",
                menJeans, new String[] { "28", "30", "32", "34", "36" });
        createProductIfNotExist("Men Stretchable Grey Jeans", "Pepe Jeans", "Grey", 2999, 2099, 30,
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
                menJeans, new String[] { "30", "32", "34", "36", "38" });

        // Seed Women's Dresses
        createProductIfNotExist("Floral Maxi Dress", "Zara", "Pink", 4999, 3499, 30,
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
                womenDress, new String[] { "S", "M", "L", "XL" });
        createProductIfNotExist("A-Line Party Dress", "H&M", "Black", 2999, 1999, 33,
                "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
                womenDress, new String[] { "S", "M", "L", "XL", "XXL" });
        createProductIfNotExist("Women's Casual Summer Dress", "ONLY", "Blue", 3499, 2449, 30,
                "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
                womenDress, new String[] { "S", "M", "L", "XL" });

        // Seed Women's Jeans
        createProductIfNotExist("Women High Rise Skinny Jeans", "H&M", "Blue", 3499, 2449, 30,
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
                womenJeans, new String[] { "28", "30", "32", "34", "36" });
        createProductIfNotExist("Women Straight Fit Black Jeans", "Zara", "Black", 3999, 2799, 30,
                "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80",
                womenJeans, new String[] { "28", "30", "32", "34" });

        // Seed Sarees
        createProductIfNotExist("Kanjivaram Silk Saree", "Kalyan", "Red", 9999, 7999, 20,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
                saree, new String[] { "Free Size" });
        createProductIfNotExist("Cotton Handloom Saree", "FabIndia", "Yellow", 3599, 2899, 19,
                "https://images.unsplash.com/photo-1583391733958-d25e07fac662?w=600&q=80",
                saree, new String[] { "Free Size" });
        createProductIfNotExist("Banarasi Silk Saree", "Kalapushpi", "Maroon", 5999, 4499, 25,
                "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=600&q=80",
                saree, new String[] { "Free Size" });

        // Seed Men's Oxfords
        createProductIfNotExist("Men's Premium Black Leather Oxfords", "Louis Philippe", "Black", 6999, 4899, 30,
                "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80",
                menOxfords, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Classic Tan Leather Derby Oxfords", "Bata", "Tan", 3999, 2799, 30,
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
                menOxfords, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Men's Loafers
        createProductIfNotExist("Men's Classic Brown Suede Loafers", "Hush Puppies", "Brown", 4999, 3499, 30,
                "https://images.unsplash.com/photo-1559544498-8547b7aa44d9?w=600&q=80",
                menLoafers, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Premium Tan Leather Slip-On Loafers", "Clarks", "Tan", 5999, 4199, 30,
                "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=600&q=80",
                menLoafers, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Men's Boots
        createProductIfNotExist("Men's Robust Khaki Chelsea Boots", "Woodland", "Khaki", 7999, 5599, 30,
                "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
                menBoots, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Robust Camel Leather Hiking Boots", "Woodland", "Camel", 8999, 6299, 30,
                "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80",
                menBoots, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Heels
        createProductIfNotExist("Women's Elegant Red Stiletto Heels", "Catwalk", "Red", 3999, 2799, 30,
                "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
                womenHeels, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Classic Black Block Heels", "Catwalk", "Black", 2999, 2099, 30,
                "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600&q=80",
                womenHeels, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Flats
        createProductIfNotExist("Women's Casual Pink Ballet Flats", "Inc.5", "Pink", 2499, 1749, 30,
                "https://images.unsplash.com/photo-1579549301053-912b9d997d6f?w=600&q=80",
                womenFlats, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Ethnic Embroidered Juttis Flats", "Bata", "Gold", 1999, 1399, 30,
                "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
                womenFlats, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Sneakers
        createProductIfNotExist("Women's Lightweight White Walking Sneakers", "Puma", "White", 4500, 3150, 30,
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
                womenSneakers, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Boots
        createProductIfNotExist("Women's Stylish Black Ankle Boots", "Carlton London", "Black", 5999, 4199, 30,
                "https://images.unsplash.com/photo-1591871987515-37351664e43e?w=600&q=80",
                womenBoots, new String[] { "6", "7", "8", "9", "10", "11" });
    }

    private void markInitialSeedCompleted() {
        if (appMetadataRepository.findByMetaKey(INITIAL_SEED_KEY).isPresent()) {
            return;
        }
        appMetadataRepository.save(new AppMetadata(null, INITIAL_SEED_KEY, "true"));
    }

    private Category getOrCreateSecondLevelCategory(String name, Category parent) {
        Category existing = categoryRepository.findByNameAndParentId(name, parent.getId());
        if (existing != null) {
            return existing;
        }
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
        if (!cats.isEmpty()) {
            return cats.get(0);
        }
        Category newCat = new Category();
        newCat.setName(name);
        newCat.setParentCategory(parent);
        newCat.setLevel(3);
        return categoryRepository.save(newCat);
    }

    private void repairMissingProductSizes() {
        for (Product product : productRepository.findAll()) {
            if (product.getSizes() != null && !product.getSizes().isEmpty()) {
                continue;
            }

            String categoryName = product.getCategory() != null ? product.getCategory().getName() : "";
            String topLevel = getTopLevelCategoryName(product);
            List<String> defaultSizes = SizeFilterHelper.getDefaultSizesForCategory(categoryName, topLevel);
            Set<Size> sizes = buildSizes(defaultSizes, product.getQuantity());
            product.setSizes(sizes);
            productRepository.save(product);
            System.out.println("Repaired missing sizes for product: " + product.getTitle());
        }
    }

    private String getTopLevelCategoryName(Product product) {
        Category category = product.getCategory();
        if (category == null) {
            return "";
        }
        while (category.getParentCategory() != null) {
            category = category.getParentCategory();
        }
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

    private Set<Size> buildSizes(List<String> sizeNames, int totalQuantity) {
        return buildSizes(sizeNames.toArray(new String[0]), totalQuantity);
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
            System.out.println("Successfully seeded product: " + title);
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
            if (updated) {
                productRepository.save(p);
                System.out.println("Repaired seeded product: " + title);
            }
        }
    }
}
