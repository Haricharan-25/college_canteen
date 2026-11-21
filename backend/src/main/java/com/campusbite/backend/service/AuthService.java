package com.campusbite.backend.service;

import com.campusbite.backend.dto.AuthDTO;
import com.campusbite.backend.model.User;
import com.campusbite.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest req) {
        if (req == null || req.getEmail() == null || req.getEmail().trim().isEmpty() ||
            req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Email and password are required.");
        }

        String cleanEmail = req.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!user.getPassword().equals(req.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        return new AuthDTO.AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }

    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest req) {
        if (req == null || req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email address is required.");
        }
        if (req.getName() == null || req.getName().trim().isEmpty()) {
            throw new RuntimeException("Full name is required.");
        }
        if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required.");
        }

        String cleanEmail = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new RuntimeException("Email is already registered. Please login.");
        }

        User user = new User();
        user.setName(req.getName().trim());
        user.setEmail(cleanEmail);
        user.setPassword(req.getPassword());
        user.setRole(req.getRole() != null && !req.getRole().trim().isEmpty() ? req.getRole().trim().toUpperCase() : "STUDENT");

        User saved = userRepository.save(user);
        return new AuthDTO.AuthResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole(),
                "Registration successful"
        );
    }
}
