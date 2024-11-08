package com.backend.services;

import com.backend.entities.Category;
import com.backend.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;

    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

    public Category getCategoryById(int cat_id){
        return categoryRepository.findById(cat_id).orElse(null);
    }

    public Category getCategoryByPrefix(String prefix){
        return categoryRepository.findByPrefix(prefix).orElse(null);
    }

    public Category createCategory(Category category){
        return categoryRepository.save(category);
    }

    public Category updateCategory(Category category){
        return categoryRepository.save(category);
    }

    public void deleteCategoryById(int cat_id){
        categoryRepository.deleteById(cat_id);
    }
}
