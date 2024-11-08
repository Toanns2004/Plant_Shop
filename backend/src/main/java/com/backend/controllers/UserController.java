package com.backend.controllers;

import com.backend.entities.User;
import com.backend.payload.request.AddUserRequest;
import com.backend.payload.request.EditUserRequest;
import com.backend.payload.response.MessageResponse;
import com.backend.repositories.UserRepository;
import com.backend.services.UserService;
import jakarta.validation.Valid;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping(value = "/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder encoder;

    @GetMapping()
    @PreAuthorize("hasRole('admin')")
    public List<User> getAllUser(){
        return userService.getAllUser();
    }

    @GetMapping("/{user_id}")
    public User getUserById(@PathVariable int user_id) {
        return userService.getUserById(user_id);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> addUser(@Valid @RequestBody AddUserRequest addUserRequest){
        if (userRepository.existsByUsername(addUserRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(addUserRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User(
                addUserRequest.getUsername(),
                addUserRequest.getFullname(),
                encoder.encode(addUserRequest.getPassword()),
                addUserRequest.getEmail(),
                addUserRequest.getPhone(),
                addUserRequest.getImage(),
                addUserRequest.getRole()
        );


        userService.addUser(user);

        return ResponseEntity.ok(new MessageResponse("User added successfully!"));
    };

    @PutMapping("/update/{user_id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> updateUser(@Valid  @PathVariable int user_id, @RequestBody EditUserRequest user){
        User exitUser = userService.getUserById(user_id);
        if(exitUser == null){
            return null;
        }

//        if (userRepository.existsByEmail(exitUser.getEmail())) {
//            return ResponseEntity
//                    .badRequest()
//                    .body(new MessageResponse("Error: Email is already in use!"));
//        }

        exitUser.setUsername(user.getUsername());
        exitUser.setFullname(user.getFullname());
        exitUser.setPassword(encoder.encode(user.getPassword()));
        exitUser.setEmail(user.getEmail());
        exitUser.setPhone(user.getPhone());
        exitUser.setImage(user.getImage());
        exitUser.setRole(user.getRole());

        userService.updateUser(exitUser);

        return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
    };

    @DeleteMapping("/delete/{user_id}")
    @PreAuthorize("hasRole('admin')")
    public void deleteUser(@PathVariable int user_id){
        userService.deleteUserById(user_id);
    }
}
