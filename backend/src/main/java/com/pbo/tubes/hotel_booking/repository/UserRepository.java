package com.pbo.tubes.hotel_booking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pbo.tubes.hotel_booking.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    java.util.List<User> findByRole(com.pbo.tubes.hotel_booking.model.Role role);
}
