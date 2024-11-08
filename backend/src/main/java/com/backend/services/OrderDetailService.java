package com.backend.services;

import com.backend.entities.OrderDetail;
import com.backend.repositories.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {
    @Autowired
    OrderDetailRepository orderDetailRepository;

    public OrderDetail createOrderDetail(OrderDetail orderDetail){
        return orderDetailRepository.save(orderDetail);
    }

    public List<OrderDetail> getOrderDetailByOrderId(int order_id){
        return orderDetailRepository.findOrderDetailByOrderId(order_id);
    }

    public void deleteOrderDetailByOrderId(int order_id){
        orderDetailRepository.deleteOrderDetailByOrderId(order_id);
    }
}
