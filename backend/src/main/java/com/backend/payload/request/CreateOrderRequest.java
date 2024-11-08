package com.backend.payload.request;

import com.backend.enums.OrderStatus;
import com.backend.enums.PayMethod;
import jakarta.validation.constraints.NotBlank;

import java.util.Date;

public class CreateOrderRequest {
    @NotBlank
    private int user_id;

    @NotBlank
    private Double total_amount;

    @NotBlank
    private String shipping_address;

    @NotBlank
    private PayMethod pay_method;

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }


    public Double getTotal_amount() {
        return total_amount;
    }

    public void setTotal_amount(Double total_amount) {
        this.total_amount = total_amount;
    }

    public String getShipping_address() {
        return shipping_address;
    }

    public void setShipping_address(String shipping_address) {
        this.shipping_address = shipping_address;
    }

    public PayMethod getPay_method() {
        return pay_method;
    }

    public void setPay_method(PayMethod pay_method) {
        this.pay_method = pay_method;
    }
}
