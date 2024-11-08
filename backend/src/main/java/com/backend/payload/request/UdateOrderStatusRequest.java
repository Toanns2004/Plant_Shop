package com.backend.payload.request;

import com.backend.enums.OrderStatus;

public class UdateOrderStatusRequest {
    private OrderStatus newStatus;

    public OrderStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(OrderStatus newStatus) {
        this.newStatus = newStatus;
    }

    @Override
    public String toString() {
        return "UdateOrderStatusRequest{" +
                "newStatus=" + newStatus +
                '}';
    }

}
