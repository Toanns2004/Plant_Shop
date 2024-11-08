package com.backend.repositories;

import com.backend.entities.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    @Query("SELECT i FROM OrderDetail i WHERE i.order.order_id = :order_id")
    List<OrderDetail> findOrderDetailByOrderId(int order_id);

    @Transactional
    @Modifying
    @Query("DELETE FROM OrderDetail i WHERE i.order.order_id = :order_id")
    void deleteOrderDetailByOrderId(int order_id);
}
