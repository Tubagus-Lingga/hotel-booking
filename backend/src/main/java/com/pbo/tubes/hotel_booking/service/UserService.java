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

    public Optional<User> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            if (passwordEncoder.matches(password, userOpt.get().getPassword())) {
                return userOpt;
            }
        }
        return Optional.empty();
    }

    public Optional<User> loginByEmail(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String storedPassword = user.getPassword();

            if (passwordEncoder.matches(password, storedPassword)) {
                return userOpt;
            } 
            else if (storedPassword.equals(password)) {
                 user.setPassword(passwordEncoder.encode(password));
                 userRepository.save(user);
                 return userOpt;
            }
        }
        return Optional.empty();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
