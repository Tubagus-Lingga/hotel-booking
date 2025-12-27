package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.Customer;
import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.repository.BookingRepository;
import com.pbo.tubes.hotel_booking.repository.KamarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private KamarRepository kamarRepository;

    public Booking createBooking(Customer customer, Long kamarId, Date checkIn, Date checkOut) {
        Optional<Kamar> kamarOpt = kamarRepository.findById(kamarId);
        if (!kamarOpt.isPresent()) {
            throw new RuntimeException("Kamar tidak ditemukan");
        }

        Kamar kamar = kamarOpt.get();
        if (!"Available".equals(kamar.getStatusKamar())) {
            throw new RuntimeException("Kamar tidak tersedia");
        }

        // Generate booking ID
        String bookingId = "BK" + System.currentTimeMillis();

        Booking booking = new Booking(bookingId, checkIn, checkOut, "Pending");
        booking.setCustomer(customer);
        booking.setKamar(kamar);

        // Update room status
        kamar.setStatusKamar("Booked");
        kamarRepository.save(kamar);

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomer_CustomerID(customerId);
    }

    public Optional<Booking> getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public Booking updateBookingStatus(String bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (!bookingOpt.isPresent()) {
            throw new RuntimeException("Booking tidak ditemukan");
        }

        Booking booking = bookingOpt.get();
        booking.setStatusPembayaran(status);
        return bookingRepository.save(booking);
    }
}
