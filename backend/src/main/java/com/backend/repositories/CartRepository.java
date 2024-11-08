package com.backend.repositories;

import com.backend.entities.Cart;
import com.backend.entities.Product;
import com.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    List<Cart> findAllByUserId(int user_id);
    Cart findByUserAndProduct(User user, Product product);
}
