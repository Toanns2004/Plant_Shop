package com.backend.repositories;

import com.backend.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    @Query("SELECT i FROM Image i WHERE i.product.product_id = :product_id")
    List<Image> findImagesByProductId(int product_id);


    @Transactional
    @Modifying
    @Query("DELETE FROM Image i WHERE i.product.product_id = :product_id")
    void deleteImagesByProduct_id(int product_id);
}
