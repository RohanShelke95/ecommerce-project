package com.zosh.util;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public final class SizeFilterHelper {

    private static final List<String> ALPHA_ORDER = List.of(
            "XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"
    );

    private SizeFilterHelper() {
    }

    public static String detectSizeType(String category) {
        String cat = category == null ? "" : category.toLowerCase();

        if (cat.contains("jeans") || cat.contains("pant")) {
            return "WAIST";
        }
        if (isShoesCategory(cat)) {
            return "SHOE";
        }
        if (isFreeSizeCategory(cat)) {
            return "FREE";
        }
        if (cat.contains("kids") || cat.endsWith("_y")) {
            return "AGE";
        }
        return "ALPHA";
    }

    public static List<String> getDefaultSizesForCategory(String category, String lavelOne) {
        String cat = category == null ? "" : category.toLowerCase();
        String level = lavelOne == null ? "" : lavelOne.toLowerCase();
        String sizeType = detectSizeType(category);

        return switch (sizeType) {
            case "WAIST" -> "kids".equals(level)
                    ? List.of("22", "24", "26", "28", "30")
                    : List.of("28", "30", "32", "34", "36", "38");
            case "SHOE" -> "kids".equals(level)
                    ? List.of("1", "2", "3", "4", "5")
                    : List.of("6", "7", "8", "9", "10", "11");
            case "FREE" -> List.of("Free Size");
            case "AGE" -> List.of("5-6Y", "7-8Y", "9-10Y", "11-12Y", "13-14Y");
            default -> List.of("S", "M", "L", "XL", "XXL", "XXXL");
        };
    }

    public static List<String> sortSizes(List<String> sizes, String sizeType) {
        List<String> sorted = new ArrayList<>(sizes);
        if ("WAIST".equals(sizeType) || "SHOE".equals(sizeType)) {
            sorted.sort(Comparator.comparingInt(SizeFilterHelper::parseNumericSize));
            return sorted;
        }
        if ("AGE".equals(sizeType)) {
            sorted.sort(Comparator.comparingInt(SizeFilterHelper::parseNumericSize));
            return sorted;
        }
        sorted.sort(Comparator.comparingInt(SizeFilterHelper::alphaOrderIndex));
        return sorted;
    }

    public static List<String> sortMixedSizes(List<String> sizes) {
        List<String> alphaSizes = new ArrayList<>();
        List<String> numericSizes = new ArrayList<>();

        for (String size : sizes) {
            if (size != null && size.matches(".*\\d.*")) {
                numericSizes.add(size);
            } else if (size != null && !size.isBlank()) {
                alphaSizes.add(size);
            }
        }

        List<String> sorted = new ArrayList<>();
        sorted.addAll(sortSizes(alphaSizes, "ALPHA"));
        sorted.addAll(sortSizes(numericSizes, "WAIST"));
        return sorted;
    }

    private static boolean isShoesCategory(String cat) {
        return cat.contains("shoe")
                || cat.equals("sneakers")
                || cat.equals("boots")
                || cat.equals("heels")
                || cat.equals("flats")
                || cat.equals("oxfords")
                || cat.equals("loafers")
                || cat.equals("sandals")
                || cat.equals("school_shoes");
    }

    private static boolean isFreeSizeCategory(String cat) {
        return cat.contains("saree")
                || cat.contains("lengha")
                || cat.contains("gouns")
                || cat.contains("watch")
                || cat.contains("wallet")
                || cat.contains("bag")
                || cat.contains("sunglass")
                || cat.contains("hat")
                || cat.contains("belt")
                || cat.equals("accessories");
    }

    private static int parseNumericSize(String size) {
        if (size == null || size.isBlank()) {
            return Integer.MAX_VALUE;
        }
        String digits = size.replaceAll("[^0-9]", "");
        if (digits.isEmpty()) {
            return Integer.MAX_VALUE;
        }
        try {
            return Integer.parseInt(digits);
        } catch (NumberFormatException ex) {
            return Integer.MAX_VALUE;
        }
    }

    private static int alphaOrderIndex(String size) {
        if (size == null) {
            return Integer.MAX_VALUE;
        }
        int index = ALPHA_ORDER.indexOf(size.toUpperCase());
        return index >= 0 ? index : ALPHA_ORDER.size() + size.compareToIgnoreCase("");
    }
}
