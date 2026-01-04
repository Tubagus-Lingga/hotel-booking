package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Optional<Invoice> findByBooking_BookingID(String bookingId);
}
