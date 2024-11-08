package com.backend.controllers;


import com.backend.entities.User;
import com.backend.enums.Role;
import com.backend.payload.request.ChangePasswordRequest;
import com.backend.payload.request.LoginRequest;
import com.backend.payload.request.RegisterRequest;
import com.backend.payload.request.UpdateUserInfoRequest;
import com.backend.payload.response.JwtResponse;
import com.backend.payload.response.MessageResponse;
import com.backend.repositories.UserRepository;
import com.backend.security.jwt.JwtUtils;
import com.backend.security.services.UserDetailsImplement;
import com.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000"})
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getFullName(),
                    userDetails.getEmail(),
                    userDetails.getPhone(),
                    userDetails.getImage(),
                    userDetails.getRole()
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password.");
        }
    }

//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//            String jwt = jwtUtils.generateJwtToken(authentication);
//
//            UserDetailsImplement userDetails = (UserDetailsImplement) authentication.getPrincipal();
//
//            return ResponseEntity.ok(new JwtResponse(
//                    jwt,
//                    userDetails.getId(),
//                    userDetails.getUsername(),
//                    userDetails.getFullName(),
//                    userDetails.getEmail(),
//                    userDetails.getPhone(),
//                    userDetails.getImage(),
//                    userDetails.getRole()
//            ));
//    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }



        // Create new user's account
        User user = new User(
                registerRequest.getUsername(),
                registerRequest.getFullname(),
                encoder.encode(registerRequest.getPassword()),
                registerRequest.getEmail(),
                registerRequest.getPhone(),
                registerRequest.getImage(),
                registerRequest.getRole()
        );


        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        String username = jwtUtils.getUserNameFromJwtToken(changePasswordRequest.getToken());

        if (!userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }


        User user = (User) userService.getUserByUsername(username).get();

        if (!encoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Current password is incorrect"));
        }

        user.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }
    @PutMapping("/change-image")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> changeImage(
            @RequestParam ("id") int id,
            @RequestParam ("image") MultipartFile image
    ){
        User updateUser = userService.getUserById(id);
        try {
            File uploadDirectory = new File("public/img");
            if (!uploadDirectory.exists()) {
                uploadDirectory.mkdirs();
            }

            String originalFilename = image.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = new Date().getTime() + fileExtension;

            String imagePath = "public/img/" + uniqueFilename;

            String existImage = updateUser.getImage();

            //delete old image if exist
            if(existImage != null){
                String existImgPath = "public/img/" + existImage;
                File exitImageFile = new File(existImgPath);
                if (exitImageFile.exists()) {
                    exitImageFile.delete();
                }
            }
            Files.copy(
                    image.getInputStream(),
                    Paths.get(imagePath),
                    StandardCopyOption.REPLACE_EXISTING
            );

            updateUser.setImage(uniqueFilename);
            userService.updateUser(updateUser);
            return ResponseEntity.ok(new MessageResponse("Image updated successfully!"));
        }catch (Exception e){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Failed to update image: " + e.getMessage()));
        }
    }

    @PutMapping("/change-info")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> changeUserInfo(
            @RequestParam ("id") int id,
            @RequestParam ("newFullName") String newFullName,
            @RequestParam ("newPhone") String newPhone
    ){
        User updateUser = userService.getUserById(id);
        updateUser.setFullname(newFullName);
        updateUser.setPhone(newPhone);
        userService.updateUser(updateUser);
        return ResponseEntity.ok(new MessageResponse("User's Info updated successfully!"));
    }
}
