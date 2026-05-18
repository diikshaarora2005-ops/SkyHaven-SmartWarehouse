package com.wms.warehouse_management.auth;

import com.wms.warehouse_management.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.wms.warehouse_management.entity.User;
import com.wms.warehouse_management.repository.UserRepository;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest authRequest) {

    	Optional<User> userOptional =
    	        userRepository.findByUsername(authRequest.getUsername());

    	if (userOptional.isPresent()) {

    	    User user = userOptional.get();

    	    if (passwordEncoder.matches(
    	            authRequest.getPassword(),
    	            user.getPassword())) {

    	    	return jwtUtil.generateToken(
    	    	        user.getUsername(),
    	    	        user.getRole());
    	    }
    	}

    	return "Invalid Username or Password";
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {

            return "Username already exists";
        }
        
        user.setPassword(
        	    passwordEncoder.encode(user.getPassword())
        	);
        userRepository.save(user);

        return "User registered successfully";
    }

    @Autowired
    private UserRepository userRepository;
}