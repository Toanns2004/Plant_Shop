package com.backend.services;

import com.backend.entities.User;
import com.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public List<User> getAllUser(){
        return userRepository.findAll();
    }
    public User getUserById(int user_id){
        return userRepository.findById(user_id).orElse(null);
    }
    public Optional<Object> getUserByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public User addUser(User user){
        return userRepository.save(user);
    }

    public User updateUser(User user){
        return userRepository.save(user);
    }
    public void deleteUserById(int user_id){
        userRepository.deleteById(user_id);
    }

}
