package com.backend.controllers;


import com.backend.entities.*;
import com.backend.enums.OrderStatus;
import com.backend.payload.request.CreateOrderRequest;
import com.backend.payload.request.UdateOrderStatusRequest;
import com.backend.payload.response.MessageResponse;
import com.backend.services.CartService;
import com.backend.services.OrderDetailService;
import com.backend.services.OrderService;
import com.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping(value = "/orders")
public class OrderController {
    @Autowired
    OrderService orderService;
    @Autowired
    OrderDetailService orderDetailService;
    @Autowired
    UserService userService;
    @Autowired
    CartService cartService;



    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }



    @GetMapping("/search")
    public ResponseEntity<List<Order>> searchOrderByCustomerName(String key) {
        List<Order> searchResults = orderService.searchOrderByCustomerName(key);
        if (searchResults.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/{order_id}")
    public Order getOrderById(@PathVariable int order_id) {
        return orderService.getOrderById(order_id);
    }
    @GetMapping("/{order_id}/details")
    public List<OrderDetail> getOrderDetailByOrderId(@PathVariable int order_id){
        return orderDetailService.getOrderDetailByOrderId(order_id);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest createOrderRequest) {
        User user = userService.getUserById(createOrderRequest.getUser_id());
        Date currentDate = new Date();
        Timestamp currentTimestamp = new Timestamp(currentDate.getTime());
        try {
            Order newOrder = new Order();
            newOrder.setUser(user);
            newOrder.setOrder_date(currentTimestamp);
            newOrder.setOrder_status(OrderStatus.waiting);
            newOrder.setTotal_amount(createOrderRequest.getTotal_amount());
            newOrder.setShipping_address(createOrderRequest.getShipping_address());
            newOrder.setPay_method(createOrderRequest.getPay_method());

            Order savedOrder = orderService.createOrder(newOrder);

            List<Cart> carts = cartService.getAllCartItems(createOrderRequest.getUser_id());
            if (carts.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("No items in the cart"));
            }
            for (Cart cartItem : carts) {
                Product product = cartItem.getProduct();
                OrderDetail newOrderDetail = new OrderDetail();
                newOrderDetail.setOrder(savedOrder);
                newOrderDetail.setProduct(product);
                newOrderDetail.setQuantity(cartItem.getQuantity());
                newOrderDetail.setPrice(product.getPrice());
                newOrderDetail.setSub_total(cartItem.getProduct().getPrice() * cartItem.getQuantity());

                orderDetailService.createOrderDetail(newOrderDetail);
            }
            cartService.deleteUserCart(createOrderRequest.getUser_id());
            return ResponseEntity.ok(new MessageResponse("Create order successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Failed to create order: " + e.getMessage()));
        }
    }

    @PutMapping("/{order_id}/update")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable int order_id, @RequestBody UdateOrderStatusRequest request){
        Optional<Order> optionalOrder = Optional.ofNullable(orderService.getOrderById(order_id));
        String newStatus = String.valueOf(request.getNewStatus());
        System.out.println(request.toString());
        if(optionalOrder.isPresent()){
            Order order = optionalOrder.get();
            order.setOrder_status(request.getNewStatus());

            orderService.updateOrder(order);
            return ResponseEntity.ok(new MessageResponse("Order status updated successfully"));
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{order_id}/delete")
    @PreAuthorize("hasRole('admin')")
    public void deleteOrderById(@PathVariable int order_id){
        Order deleteOrder = orderService.getOrderById(order_id);
        if(deleteOrder != null){
            List<OrderDetail> deleteOrderDetails = orderDetailService.getOrderDetailByOrderId(order_id);
            if(!deleteOrderDetails.isEmpty()){
                orderDetailService.deleteOrderDetailByOrderId(order_id);
            }
            orderService.deleteOrder(order_id);
        }
    }
}