package com.backend.repositories;

import com.backend.entities.Category;
import com.backend.entities.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

//    List<Product> findByCategoryPrefix(String prefix);
    @Query("SELECT p FROM Product p WHERE p.product_name LIKE %:key%")
    List<Product> findByNameContaining(String key);

    @Query(value = "SELECT * FROM products WHERE cat_id = :categoryId ORDER BY RAND() LIMIT 8", nativeQuery = true)
    List<Product> findRandomProductsByCategoryId(@Param("categoryId") int categoryId);


    @Query("SELECT p FROM Product p ORDER BY p.product_id DESC LIMIT 10")
    List<Product> findTop10NewestProducts();

    @Query("SELECT p FROM Product p WHERE p.category.prefix = :prefix")
    List<Product> getProductsByCategoryPrefix(@Param("prefix") String prefix);
}
