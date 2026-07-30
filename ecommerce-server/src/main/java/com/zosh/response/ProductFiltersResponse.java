package com.zosh.response;

import java.util.List;

public class ProductFiltersResponse {

    private List<String> colors;
    private List<String> sizes;
    private String sizeType;
    private int minPrice;
    private int maxPrice;

    public ProductFiltersResponse() {
    }

    public ProductFiltersResponse(List<String> colors, List<String> sizes, String sizeType, int minPrice, int maxPrice) {
        this.colors = colors;
        this.sizes = sizes;
        this.sizeType = sizeType;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public List<String> getColors() {
        return colors;
    }

    public void setColors(List<String> colors) {
        this.colors = colors;
    }

    public List<String> getSizes() {
        return sizes;
    }

    public void setSizes(List<String> sizes) {
        this.sizes = sizes;
    }

    public String getSizeType() {
        return sizeType;
    }

    public void setSizeType(String sizeType) {
        this.sizeType = sizeType;
    }

    public int getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(int minPrice) {
        this.minPrice = minPrice;
    }

    public int getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(int maxPrice) {
        this.maxPrice = maxPrice;
    }
}
