package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByUser_Id(Long userId);
}
