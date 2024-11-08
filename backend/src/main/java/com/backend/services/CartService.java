package com.backend.services;

import com.backend.entities.Cart;
import com.backend.entities.Product;
import com.backend.entities.User;
import com.backend.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    CartRepository cartRepository;

    public List<Cart> getAllCartItems(int user_id){
        return cartRepository.findAllByUserId(user_id);
    }
    public Cart getCartByUserAndProduct(User user, Product product){
        return cartRepository.findByUserAndProduct(user, product);
    }

    public Cart addItemToCart(Cart cart){
        return cartRepository.save(cart);
    }

    public Cart updateCartItem(Cart cart){
        Cart existCart = cartRepository.findById(cart.getCart_id()).orElse(null);
        if(existCart != null){
            existCart.setQuantity(cart.getQuantity());
            return cartRepository.save(existCart);
        }else {
            throw new RuntimeException("Cart item not found!");
        }
    }

    public void updateCartItemQty(int cart_id, int newQty) throws Exception {
        Optional<Cart> existCartItem = cartRepository.findById(cart_id);
        if(existCartItem.isPresent()){
            Cart updateCart = existCartItem.get();
            updateCart.setQuantity(newQty);
            cartRepository.save(updateCart);
        }else {
            throw new Exception("Product not found");
        }
    }

    public void deleteCartItem(int cart_id){
        cartRepository.deleteById(cart_id);
    }
    public void deleteUserCart(int user_id){
        List<Cart> deleteCarts = cartRepository.findAllByUserId(user_id);
        cartRepository.deleteAll(deleteCarts);
    }

}
