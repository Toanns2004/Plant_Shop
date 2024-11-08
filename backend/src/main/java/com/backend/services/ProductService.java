package com.backend.services;


import com.backend.entities.Product;
import com.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

//    public List<Product> getProductsByCategory(String prefix){
//        return productRepository.findByCategoryPrefix(prefix);
//    }

    public List<Product> searchProductsByName(String key) {
        return productRepository.findByNameContaining(key);
    }
    public Product getProductById(int product_id){
        return productRepository.findById(product_id).orElse(null);
    }
    public List<Product> getRandomProductsByCategoryId(int category_id) {
        return productRepository.findRandomProductsByCategoryId(category_id);
    }

    public List<Product> getNewestProducts(){
        return productRepository.findTop10NewestProducts();
    }

    public List<Product> getProductsByCategoryPrefix(String prefix){
        return productRepository.getProductsByCategoryPrefix(prefix);
    }

    public Product createProduct(Product product){
        return productRepository.save(product);
    }

    public Product updateProduct(Product product){
        return productRepository.save(product);
    }

    public void deleteProductById(int product_id){
        productRepository.deleteById(product_id);
    }
}
