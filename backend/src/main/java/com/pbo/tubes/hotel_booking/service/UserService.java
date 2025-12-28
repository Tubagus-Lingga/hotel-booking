package com.pbo.tubes.hotel_booking.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Login with username
    public Optional<User> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt;
        }
        return Optional.empty();
    }

    // Login with email
    public Optional<User> loginByEmail(String email, String password) {
        System.out.println("DEBUG: Attempting login for email: " + email);
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            System.out.println("DEBUG: User found in database.");
            String storedPassword = userOpt.get().getPassword();
            System.out.println("DEBUG: Input Password: '" + password + "'");
            System.out.println("DEBUG: Stored Password: '" + storedPassword + "'");

            if (storedPassword.equals(password)) {
                System.out.println("DEBUG: Password MATCH!");
                return userOpt;
            } else {
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
