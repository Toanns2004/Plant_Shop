package com.backend.services;

import com.backend.entities.Order;
import com.backend.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    public List<Order> searchOrderByCustomerName(String key){
        return orderRepository.findCustomerByName(key);
    }

    public Order getOrderById(int order_id){
        return orderRepository.findById(order_id).orElse(null);
    }

    public Order createOrder(Order order){
        return orderRepository.save(order);
    }

    public Order updateOrder(Order order){
        return orderRepository.save(order);
    }

    public void deleteOrder(int order_id){
        orderRepository.deleteById(order_id);
    }
}
