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

    // 🔹 LOGIN
    public Optional<User> login(String username, String password) {
        return userRepository.findByUsername(username);
    }

    // ✅ TAMBAHKAN INI (WAJIB UNTUK REGISTER)
    public void save(User user) {
        userRepository.save(user);
    }
}
