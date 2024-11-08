package com.backend.controllers;


import com.backend.entities.Category;
import com.backend.entities.Product;
import com.backend.payload.request.CreateCategoryRequest;
import com.backend.payload.request.UpdateCategoryRequest;
import com.backend.payload.response.MessageResponse;
import com.backend.services.CategoryService;
import com.backend.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;
    @Autowired
    ProductService productService;

    @GetMapping()
    @PreAuthorize("hasRole('admin')")
    public List<Category> getAllCategories(){
        return categoryService.getAllCategories();
    }

    @GetMapping("/id/{cat_id}")
    public Category getCategoryById(@PathVariable int cat_id){
        return categoryService.getCategoryById(cat_id);
    }

    @GetMapping("/prefix/{prefix}")
    public Category getCategoryByPrefix(@PathVariable String prefix){
        return categoryService.getCategoryByPrefix(prefix);
    }
    @GetMapping("/{prefix}")
    public List<Product> getProductsByCategoryPrefix(@PathVariable String prefix){
        return productService.getProductsByCategoryPrefix(prefix);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> createCategory(@RequestBody CreateCategoryRequest createCategoryRequest){
        Category category = new Category(
                createCategoryRequest.getPrefix(),
                createCategoryRequest.getCat_name(),
                createCategoryRequest.getCat_description()
        );

        categoryService.createCategory(category);

        return ResponseEntity.ok(new MessageResponse("Category created successfully!"));
    }

    @PutMapping("/update/{cat_id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> updateCategory(@PathVariable int cat_id, @RequestBody UpdateCategoryRequest updateCategoryRequest){
        Category exitCategory = categoryService.getCategoryById(cat_id);
        if(exitCategory == null){
            return null;
        }

        exitCategory.setPrefix(updateCategoryRequest.getPrefix());
        exitCategory.setCat_name(updateCategoryRequest.getCat_name());
        exitCategory.setCat_description(updateCategoryRequest.getCat_description());

        categoryService.updateCategory(exitCategory);

        return ResponseEntity.ok(new MessageResponse("Category updated!"));
    }

    @DeleteMapping("/delete/{cat_id}")
    @PreAuthorize("hasRole('admin')")
    public void deleteCategory(@PathVariable int cat_id){
        categoryService.deleteCategoryById(cat_id);
    }
}
