package com.backend.controllers;


import com.backend.entities.Category;
import com.backend.entities.Image;
import com.backend.entities.Product;
import com.backend.payload.request.UpdateProductRequest;
import com.backend.payload.response.MessageResponse;
import com.backend.services.CategoryService;
import com.backend.services.ImageService;
import com.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import java.util.UUID;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping(value = "/products")
public class ProductController {
    @Autowired
    ProductService productService;
    @Autowired
    CategoryService categoryService;
    @Autowired
    ImageService imageService;

    @GetMapping
    public List<Product> getAllProduct(){
        return productService.getAllProducts();
    }

//    @GetMapping("/{prefix}")
//    public List<Product> getProductByCategory(@PathVariable String prefix){
//        return productService.getProductsByCategory(prefix);
//    }
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProductByName(@RequestParam String key){
        List<Product> searchResults = productService.searchProductsByName(key);
        if (searchResults.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/{product_id}")
    public Product getProductById(@PathVariable int product_id){
        return productService.getProductById(product_id);
    }


    @GetMapping("/random/{category_id}")
    public List<Product> randomProductByCategory(@PathVariable int category_id){
        return productService.getRandomProductsByCategoryId(category_id);
    }

    @GetMapping("/top/newest")
    public List<Product> getNewestProducts(){
        return productService.getNewestProducts();
    }

    @GetMapping("/{product_id}/images")
    public List<Image> getAllImagesOfProduct(@PathVariable int product_id){
        return imageService.getImagesByProductId(product_id);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> createProduct(
            @RequestParam("product_name") String productName,
            @RequestParam("cat_id") Integer catId,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam("available") Integer available,
            @RequestParam("images") List<MultipartFile> images
    ){

        try {
            File uploadDirectory = new File("public/img");
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            String originalFilename = thumbnail.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = new Date().getTime() + fileExtension;

            String imagePath = "public/img/" + uniqueFilename;


            Files.copy(
                    thumbnail.getInputStream(),
                    Paths.get(imagePath),
                    StandardCopyOption.REPLACE_EXISTING
            );

            Category category = categoryService.getCategoryById(catId);

            Product newProduct = new Product(
                    productName,
                    category,
                    description,
                    price,
                    uniqueFilename,
                    available
            );

            Product savedProduct = productService.createProduct(newProduct);

            for (MultipartFile image : images){
                File uploadDirectory1 = new File("public/img");
                if (!uploadDirectory1.exists()) {
                    uploadDirectory1.mkdirs();
                }

                String originalFilename1 = image.getOriginalFilename();
                String fileExtension1 = originalFilename1.substring(originalFilename1.lastIndexOf("."));
                String uniqueFilename1 = new Date().getTime() + fileExtension1;

                String imagePath1 = "public/img/" + uniqueFilename1;


                Files.copy(
                        image.getInputStream(),
                        Paths.get(imagePath1),
                        StandardCopyOption.REPLACE_EXISTING
                );

                Image newImage = new Image(
                        uniqueFilename1,
                        savedProduct
                );

                imageService.createImage(newImage);
            }


            return ResponseEntity.ok(new MessageResponse("Product created successfully!"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Failed to create product: " + e.getMessage()));
        }

    }

    @PutMapping("/update/{product_id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> updateProduct(@PathVariable int product_id,
                                           @RequestParam("product_name") String product_name,
                                           @RequestParam("cat_id") int cat_id,
                                           @RequestParam("description") String description,
                                           @RequestParam("price") Double price,
                                           @RequestParam("available") int available,
                                           @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
                                           @RequestParam(value = "newImages", required = false) List<MultipartFile> images,
                                           @RequestParam("deleteImages") List<Integer> deleteImages
                                           ){

        try {
            Product updateProduct = productService.getProductById(product_id);
            if(updateProduct == null){
                return null;
            };

            //delete deleteImages

            if (!deleteImages.isEmpty()){
                for (int imageID : deleteImages) {
                    imageService.deleteImageById(imageID);
                    }
            }

            //handle thumbnail change
            if(thumbnail != null){
                //delete old thumbnail
                String thumbnailName = updateProduct.getThumbnail();
                if (thumbnailName != null) {
                    String thumbnailPath = "public/img/" + thumbnailName;
                    File thumbnailFile = new File(thumbnailPath);
                    if (thumbnailFile.exists()) {
                        thumbnailFile.delete();
                    }
                }

                //upload new thumb
                File uploadDirectory = new File("public/img");
                if (!uploadDirectory.exists()) {
                    uploadDirectory.mkdirs();
                }

                String originalFilename = thumbnail.getOriginalFilename();
                String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String uniqueFilename = new Date().getTime() + fileExtension;

                String imagePath = "public/img/" + uniqueFilename;
                Files.copy(
                        thumbnail.getInputStream(),
                        Paths.get(imagePath),
                        StandardCopyOption.REPLACE_EXISTING
                );
                updateProduct.setThumbnail(uniqueFilename);
            }

            //save info
            Category updateCategory = categoryService.getCategoryById(cat_id);
            updateProduct.setProduct_name(product_name);
            updateProduct.setDescription(description);
            updateProduct.setCategory(updateCategory);
            updateProduct.setAvailable(available);
            updateProduct.setPrice(price);

            productService.updateProduct(updateProduct);

            //save new images
            if (images != null) {
                for (MultipartFile image : images){
                    File uploadDirectory1 = new File("public/img");
                    if (!uploadDirectory1.exists()) {
                        uploadDirectory1.mkdirs();
                    }

                    String originalFilename1 = image.getOriginalFilename();
                    String fileExtension1 = originalFilename1.substring(originalFilename1.lastIndexOf("."));
                    String uniqueFilename1 = new Date().getTime() + fileExtension1;

                    String imagePath1 = "public/img/" + uniqueFilename1;

                    Files.copy(
                            image.getInputStream(),
                            Paths.get(imagePath1),
                            StandardCopyOption.REPLACE_EXISTING
                    );

                    Image newImage = new Image(
                            uniqueFilename1,
                            updateProduct
                    );

                    imageService.createImage(newImage);
                }
            }
            
            return ResponseEntity.ok(new MessageResponse("Product updated successfully!"));

        }catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Failed to create product: " + e.getMessage()));
        }

    }

    @DeleteMapping("delete/{product_id}")
    @PreAuthorize("hasRole('admin')")
    public void deleteProduct(@PathVariable int product_id){
        Product deleteProduct = productService.getProductById(product_id);
        if(deleteProduct != null){
            //delete thumbnail
            String thumbnailName = deleteProduct.getThumbnail();
            if (thumbnailName != null) {
                String thumbnailPath = "public/img/" + thumbnailName;
                File thumbnailFile = new File(thumbnailPath);
                if (thumbnailFile.exists()) {
                    thumbnailFile.delete();
                }
            }

            //delete images
            List<Image> deleteImages = imageService.getImagesByProductId(product_id);
            for (Image image : deleteImages) {
                String imgName = image.getImg_name();
                String imagePath = "public/img/" + imgName;
                File imgFile = new File(imagePath);
                if (imgFile.exists()) {
                    imgFile.delete();
                }
            }
            if (!deleteImages.isEmpty()) {
                imageService.deleteAllByProductId(product_id);
            }
            productService.deleteProductById(product_id);
        }
    }
}
