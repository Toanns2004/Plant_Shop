package com.backend.services;

import com.backend.entities.Image;
import com.backend.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImageService {
    @Autowired
    ImageRepository imageRepository;
    public Image createImage(Image image){
        return imageRepository.save(image);
    }
    public void deleteImageById(int img_id){
        imageRepository.deleteById(img_id);
    }

    public List<Image> getImagesByProductId(int product_id){
        return imageRepository.findImagesByProductId(product_id);
    }

    public void deleteAllByProductId(int product_id){
        imageRepository.deleteImagesByProduct_id(product_id);
    }
}
