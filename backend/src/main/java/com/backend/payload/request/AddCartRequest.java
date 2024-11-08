package com.backend.payload.request;

import jakarta.validation.constraints.NotBlank;

public class AddCartRequest {
    @NotBlank
    private int user_id;

    @NotBlank
    private int product_id;

    @NotBlank
    private int quantity;

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
