package com.pbo.tubes.hotel_booking.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Login with username
    public Optional<User> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            if (passwordEncoder.matches(password, userOpt.get().getPassword())) {
                return userOpt;
            }
        }
        return Optional.empty();
    }

    // Login with email
    public Optional<User> loginByEmail(String email, String password) {
        System.out.println("DEBUG: Attempting login for email: " + email);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String storedPassword = user.getPassword();
            System.out.println("DEBUG: User found in database.");

            // 1. Cek apakah password match dengan BCrypt hash
            if (passwordEncoder.matches(password, storedPassword)) {
                System.out.println("DEBUG: Password MATCH (Hash)!");
                return userOpt;
            } 
            // 2. Jika gagal check hash, coba cek plain text (Migration Support)
            else if (storedPassword.equals(password)) {
                 System.out.println("DEBUG: Password MATCH (Plain Text) - Migrating to Hash...");
                 // Update password ke hash
                 user.setPassword(passwordEncoder.encode(password));
                 userRepository.save(user); // Simpan hash baru
                 return userOpt;
            }
            else {
                System.out.println("DEBUG: Password MISMATCH!");
            }
        } else {
            System.out.println("DEBUG: User NOT found in database.");
        }
        return Optional.empty();
    }

    // Find by email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Save user and return saved entity
    public User save(User user) {
        return userRepository.save(user);
    }
}
