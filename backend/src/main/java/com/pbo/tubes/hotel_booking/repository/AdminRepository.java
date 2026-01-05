package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Admin;
import com.pbo.tubes.hotel_booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUser(User user);
}
