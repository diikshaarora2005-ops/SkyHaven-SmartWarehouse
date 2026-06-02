package com.wms.warehouse_management.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(request -> {

                CorsConfiguration config =
                        new CorsConfiguration();

                config.setAllowedOrigins(
                	    List.of(
                	        "http://localhost:5175",
                	        "http://localhost:5176",
                	        "http://localhost:5177"
                	    )
                	);

                config.setAllowedMethods(
                        List.of("*"));

                config.setAllowedHeaders(
                        List.of("*"));

                config.setAllowCredentials(true);

                return config;
            }))

            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                    .anyRequest().permitAll());

        return http.build();
    }
}