package com.backend.controllers;

import com.backend.entities.Cart;
import com.backend.entities.Product;
import com.backend.entities.User;
import com.backend.payload.request.AddCartRequest;
import com.backend.payload.request.UpdateCartQtyRequest;
import com.backend.payload.response.MessageResponse;
import com.backend.services.CartService;
import com.backend.services.ProductService;
import com.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:3000")
@RestController
@PreAuthorize("hasRole('user')")
@RequestMapping(value = "/cart")
public class CartController {
    @Autowired
    CartService cartService;
    @Autowired
    UserService userService;
    @Autowired
    ProductService productService;

    @GetMapping("/{user_id}")
    List<Cart> getCartItems(@PathVariable int user_id){
        return cartService.getAllCartItems(user_id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddCartRequest addCartRequest){
        try {
            User user = userService.getUserById(addCartRequest.getUser_id());
            Product product = productService.getProductById(addCartRequest.getProduct_id());

            Cart existCart = cartService.getCartByUserAndProduct(user, product);

            if(existCart != null){
                existCart.setQuantity(existCart.getQuantity() + addCartRequest.getQuantity());
                cartService.updateCartItem(existCart);
            }else {
                Cart cart = new Cart(
                        user,
                        product,
                        addCartRequest.getQuantity()
                );
                cartService.addItemToCart(cart);
            }
            return ResponseEntity.ok(new MessageResponse("Add to cart successfully"));
        }catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Failed to add product to cart: " + e.getMessage()));
        }
    }

    @PutMapping("/updateqty/{cart_id}")
    public ResponseEntity<?> updateCartItemQty(@PathVariable int cart_id, @RequestBody UpdateCartQtyRequest updateCartQtyRequest){
        try {
            cartService.updateCartItemQty(cart_id, updateCartQtyRequest.getNewQty());
            return ResponseEntity.ok(new MessageResponse("Update cart qty successfully"));
        }catch (Exception e){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Failed to update qty: " + e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{cart_id}")
    public void deleteCartItem(@PathVariable int cart_id){
        cartService.deleteCartItem(cart_id);
    }

    @DeleteMapping("/{user_id}/delete")
    public void deleteUserCart(@PathVariable int user_id){
        cartService.deleteUserCart(user_id);
    }


}
