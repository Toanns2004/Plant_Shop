package com.backend.security.services;

import com.backend.entities.User;
import com.backend.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserDetailsImplement implements UserDetails {
    private static final long serialVersionUID = 1L;

    private int user_id;
    private String username;
    private String fullname;
    @JsonIgnore
    private String password;
    private String email;
    private String phone;
    private String image;
    @Enumerated(EnumType.STRING)
    private Role role;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImplement(int id, String username, String fullname, String password, String email, String phone, String image, Role role, Collection<? extends GrantedAuthority> authorities) {
        this.user_id = id;
        this.username = username;
        this.fullname = fullname;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.image = image;
        this.role = role;
        this.authorities = authorities;
    }

    public static UserDetailsImplement build(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));

        return new UserDetailsImplement(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getPassword(),
                user.getEmail(),
                user.getPhone(),
                user.getImage(),
                user.getRole(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public int getId() {
        return user_id;
    }

    public String getEmail() {
        return email;
    }
    public String getPhone(){
        return phone;
    }

    public String getImage(){
        return image;
    }

    public Role getRole() {
        return role;
    }
    public String getFullName(){
        return fullname;
    }
}
