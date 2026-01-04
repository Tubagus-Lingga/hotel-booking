package com.pbo.tubes.hotel_booking.service;

import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.Payment;
import com.pbo.tubes.hotel_booking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPayment(Booking booking, String metodePembayaran, Double totalPembayaran) {
        String paymentId = "PAY" + System.currentTimeMillis();

        Payment payment = new Payment(paymentId, new Date(), metodePembayaran, totalPembayaran);
        payment.setBooking(booking);

        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentByBookingId(String bookingId) {
        return paymentRepository.findByBooking_BookingID(bookingId);
    }
}
