package com.backend.entities;

import com.backend.enums.OrderStatus;
import com.backend.enums.PayMethod;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int order_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "order_date")
    private Date order_date;

    @Column(name = "order_status")
    @Enumerated(EnumType.STRING)
    private OrderStatus order_status;

    @Column(name = "total_amount")
    private Double total_amount;

    @Column(name = "shipping_address")
    private String shipping_address;

    @Column(name = "pay_method")
    @Enumerated(EnumType.STRING)
    private PayMethod pay_method;

    public Order(User user, Date order_date, OrderStatus order_status, Double total_amount, String shipping_address, PayMethod pay_method) {
        this.user = user;
        this.order_date = order_date;
        this.order_status = order_status;
        this.total_amount = total_amount;
        this.shipping_address = shipping_address;
        this.pay_method = pay_method;
    }

    public Order(){super();}

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getOrder_date() {
        return order_date;
    }

    public void setOrder_date(Date order_date) {
        this.order_date = order_date;
    }

    public OrderStatus getOrder_status() {
        return order_status;
    }

    public void setOrder_status(OrderStatus order_status) {
        this.order_status = order_status;
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
