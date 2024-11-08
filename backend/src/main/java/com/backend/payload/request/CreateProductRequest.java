package com.backend.payload.request;

import com.backend.entities.Category;
import jakarta.validation.constraints.NotBlank;

import java.io.File;

public class CreateProductRequest {
    @NotBlank
    private String product_name;

    @NotBlank
    private int cat_id;

    private String description;

    @NotBlank
    private Double price;

    private File thumbnail;

    @NotBlank
    private int available;

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public int getCat_id() {
        return cat_id;
    }

    public void setCat_id(int cat_id) {
        this.cat_id = cat_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public File getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(File thumbnail) {
        this.thumbnail = thumbnail;
    }

    public int getAvailable() {
        return available;
    }

    public void setAvailable(int available) {
        this.available = available;
    }
}
