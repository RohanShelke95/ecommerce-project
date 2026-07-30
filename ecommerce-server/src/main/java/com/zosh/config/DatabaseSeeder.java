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
                "https://rukminim1.flixcart.com/image/612/612/l5h2xe80/kurta/x/6/n/xl-kast-tile-green-majestic-man-original-imagg4z33hu4kzpv.jpeg?q=70",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL" });
        createProductIfNotExist("Men Embroidered Jacquard Straight Kurta", "SG LEMAN", "Yellow", 2499, 799, 68,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/kurta/l/f/r/xl-k-spl668-yellow-sg-leman-original-imagznqcrahgq9rf.jpeg?q=70",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL" });
        createProductIfNotExist("Embroidered Cotton Kurta", "Manyavar", "Blue", 2999, 2499, 16,
                "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/g/6/k/m-sk-kurta-112-blue-sk-avish-original-imags3atfyhgzghy.jpeg?q=70",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL", "XXXL" });
        createProductIfNotExist("White Pure Cotton Kurta", "Peter England", "White", 1299, 999, 23,
                "https://rukminim2.flixcart.com/image/612/612/xif0q/kurta/w/h/i/m-kurta-white-sk-avish-original-imags3atfyhgzghy.jpeg?q=70",
                mensKurta, new String[] { "S", "M", "L", "XL", "XXL" });

        // Seed Men's Jeans
        createProductIfNotExist("Men Slim Fit Blue Jeans", "Levis", "Blue", 3999, 2799, 30,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/jean/e/z/3/32-m-725360725360-levis-original-imagz8q6q6q6q6q6.jpeg?q=70",
                menJeans, new String[] { "28", "30", "32", "34", "36", "38" });
        createProductIfNotExist("Men Regular Fit Black Jeans", "Wrangler", "Black", 3499, 2449, 30,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/jean/b/l/k/32-m-wrangler-black-original-imagz8q6q6q6q6q6.jpeg?q=70",
                menJeans, new String[] { "28", "30", "32", "34", "36" });
        createProductIfNotExist("Men Stretchable Grey Jeans", "Pepe Jeans", "Grey", 2999, 2099, 30,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/jean/g/r/y/32-m-pepe-grey-original-imagz8q6q6q6q6q6.jpeg?q=70",
                menJeans, new String[] { "30", "32", "34", "36", "38" });

        // Seed Women's Dresses
        createProductIfNotExist("Floral Maxi Dress", "Zara", "Pink", 4999, 3499, 30,
                "https://rukminim2.flixcart.com/image/612/612/xif0q/dress/p/n/k/s-zara-pink-maxi-original-imags5fhzfhzfhzf.jpeg?q=70",
                womenDress, new String[] { "S", "M", "L", "XL" });
        createProductIfNotExist("A-Line Party Dress", "H&M", "Black", 2999, 1999, 33,
                "https://rukminim2.flixcart.com/image/612/612/xif0q/dress/b/l/k/s-hm-black-aline-original-imags5fhzfhzfhzf.jpeg?q=70",
                womenDress, new String[] { "S", "M", "L", "XL", "XXL" });
        createProductIfNotExist("Women's Casual Summer Dress", "ONLY", "Blue", 3499, 2449, 30,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/dress/7/h/r/xl-odr102893-blue-only-original-imagzge4czcruj2f.jpeg?q=70",
                womenDress, new String[] { "S", "M", "L", "XL" });

        // Seed Women's Jeans
        createProductIfNotExist("Women High Rise Skinny Jeans", "H&M", "Blue", 3499, 2449, 30,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/jean/b/l/u/28-s-hm-women-blue-original-imagz8q6q6q6q6q6.jpeg?q=70",
                womenJeans, new String[] { "28", "30", "32", "34", "36" });
        createProductIfNotExist("Women Straight Fit Black Jeans", "Zara", "Black", 3999, 2799, 30,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/jean/b/l/a/28-s-zara-women-black-original-imagz8q6q6q6q6q6.jpeg?q=70",
                womenJeans, new String[] { "28", "30", "32", "34" });

        // Seed Sarees
        createProductIfNotExist("Kanjivaram Silk Saree", "Kalyan", "Red", 9999, 7999, 20,
                "https://rukminim2.flixcart.com/image/612/612/xif0q/saree/r/e/d/kanjivaram-silk-original-imags5fhzfhzfhzf.jpeg?q=70",
                saree, new String[] { "Free Size" });
        createProductIfNotExist("Cotton Handloom Saree", "FabIndia", "Yellow", 3599, 2899, 19,
                "https://rukminim2.flixcart.com/image/612/612/xif0q/saree/y/e/l/cotton-handloom-original-imags5fhzfhzfhzf.jpeg?q=70",
                saree, new String[] { "Free Size" });
        createProductIfNotExist("Banarasi Silk Saree", "Kalapushpi", "Maroon", 5999, 4499, 25,
                "https://rukminim1.flixcart.com/image/612/612/xif0q/sari/5/z/k/free-banarasi-saree-kalapushpi-unstitched-original-imagm5vz25z6fmuj.jpeg?q=70",
                saree, new String[] { "Free Size" });

        // Seed Men's Oxfords
        createProductIfNotExist("Men's Premium Black Leather Oxfords", "Louis Philippe", "Black", 6999, 4899, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/19818816/2022/9/5/1f31fdf7-b08e-49b0-911b-689b940db95e1662369680373-Louis-Philippe-Men-Formal-Shoes-4561662369680066-1.jpg",
                menOxfords, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Classic Tan Leather Derby Oxfords", "Bata", "Tan", 3999, 2799, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/15418192/2021/9/13/2e38c9c6-8d69-42b7-862d-0b730f7c22991631526462744BataMenTanDerbyFormalShoes1.jpg",
                menOxfords, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Men's Loafers
        createProductIfNotExist("Men's Classic Brown Suede Loafers", "Hush Puppies", "Brown", 4999, 3499, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/13600570/2021/3/10/f1fe6863-7182-45e0-b6f7-b6f125a2df6a1615367623348-Hush-Puppies-Men-Teal-Solid-Suede-Loafers-8911615367622998-1.jpg",
                menLoafers, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Premium Tan Leather Slip-On Loafers", "Clarks", "Tan", 5999, 4199, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/22753654/2023/4/12/36cc1725-d91d-44a6-ba92-7f7229e612801681283870826RedTapeMenBrownLoafers1.jpg",
                menLoafers, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Men's Boots
        createProductIfNotExist("Men's Robust Khaki Chelsea Boots", "Woodland", "Khaki", 7999, 5599, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/22328120/2023/3/13/46e4b859-f81d-4de6-976e-b6a15e612fbd1678712399933WoodlandMenKhakiLeatherChelseaBoots1.jpg",
                menBoots, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Robust Camel Leather Hiking Boots", "Woodland", "Camel", 8999, 6299, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/12836262/2020/12/3/f919d3ee-180b-465f-ae98-5c1cfca9574d1606990597371-Woodland-Men-Camel-Leather-Flat-Boots-5641606990595995-1.jpg",
                menBoots, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Heels
        createProductIfNotExist("Women's Elegant Red Stiletto Heels", "Catwalk", "Red", 3999, 2799, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/19875630/2022/9/9/2e90f230-b353-48b2-b13c-0e782ea2bebe1662707204938Heels1.jpg",
                womenHeels, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Classic Black Block Heels", "Catwalk", "Black", 2999, 2099, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/17154238/2022/3/29/7ffc0c67-64ce-4277-a739-e938f328ce781648550186987-Catwalk-Women-Heels-4721648550186542-1.jpg",
                womenHeels, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Flats
        createProductIfNotExist("Women's Casual Pink Ballet Flats", "Inc.5", "Pink", 2499, 1749, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/22369812/2023/3/16/be6517a6-68fb-476c-94d3-0599c9c84e1b1678955210744Inc5WomenPinkFlats1.jpg",
                womenFlats, new String[] { "6", "7", "8", "9", "10", "11" });
        createProductIfNotExist("Ethnic Embroidered Juttis Flats", "Bata", "Gold", 1999, 1399, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/23472098/2023/5/30/cd61b9cf-2b0e-436f-b02f-b4b105ea36be1685419842525BataWomenGoldTexturedJuttis1.jpg",
                womenFlats, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Sneakers
        createProductIfNotExist("Women's Lightweight White Walking Sneakers", "Puma", "White", 4500, 3150, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/24683058/2023/8/28/be5ad497-6a10-449e-b9ef-d4d12f1dbf701693213074811PumaWomenWhiteSneakers1.jpg",
                womenSneakers, new String[] { "6", "7", "8", "9", "10", "11" });

        // Seed Women's Boots
        createProductIfNotExist("Women's Stylish Black Ankle Boots", "Carlton London", "Black", 5999, 4199, 30,
                "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/15729188/2021/10/5/3de9ea9f-cd0d-40de-985c-06d20366ebbb1633425942478CarltonLondonWomenBlackBoots1.jpg",
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
