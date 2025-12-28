package com.pbo.tubes.hotel_booking.repository;

import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByCustomer_CustomerID(Long customerId);

    List<Booking> findByKamar_Id(Long kamarId);

    List<Booking> findByCustomer(Customer customer);
}
