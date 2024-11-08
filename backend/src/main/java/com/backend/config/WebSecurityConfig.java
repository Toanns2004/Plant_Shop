package com.backend.config;

import com.backend.security.jwt.AuthEntryPointJwt;
import com.backend.security.jwt.AuthTokenFilter;
import com.backend.security.services.UserDetailsServiceImplement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;



@Configuration
@EnableWebSecurity
@CrossOrigin(origins = {"http://localhost:3000"})
public class WebSecurityConfig{
    @Autowired
    UserDetailsServiceImplement userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/auth/**").permitAll()
                                .requestMatchers("/users").hasAuthority("admin")
                                .requestMatchers("/users/").authenticated()
                                .requestMatchers("/users/add").hasAuthority("admin")
                                .requestMatchers("/users/update/").hasAuthority("admin")
                                .requestMatchers("/users/delete/").hasAuthority("admin")
                                .requestMatchers("/categories").permitAll()
                                .requestMatchers("/categories/**").permitAll()
                                .requestMatchers("/categories/create").hasAuthority("admin")
                                .requestMatchers("/categories/update/").hasAuthority("admin")
                                .requestMatchers("/categories/delete/").hasAuthority("admin")
                                .requestMatchers("/products").permitAll()
                                .requestMatchers("/products/**").permitAll()
                                .requestMatchers("/products/create").hasAuthority("admin")
                                .requestMatchers("/products/update/").hasAuthority("admin")
                                .requestMatchers("/products/delete/").hasAuthority("admin")
                                .requestMatchers("/images").permitAll()
                                .requestMatchers("/images/**").permitAll()
                                .requestMatchers("/images/delete/").hasAuthority("admin")
                                .requestMatchers("/cart/**").hasAuthority("user")
                                .requestMatchers("/orders/update").hasAuthority("admin")
                                .requestMatchers("/orders/delete").hasAuthority("admin")
                                .anyRequest().authenticated()

                );

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000"); // Thay thế example.com bằng địa chỉ của trang web bạn muốn cho phép truy cập.
        config.addAllowedHeader("*");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("HEAD");
        config.addAllowedMethod("GET");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("PATCH");
        source.registerCorsConfiguration("/**", config);
        return source;
    }


}
