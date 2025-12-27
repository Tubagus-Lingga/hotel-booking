package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByBooking_BookingID(String bookingId);
}
