package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.dto.BookingRequest;
import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerApiController {

    private final BookingService bookingService;

    public CustomerApiController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // 1. Add to Cart (Create Booking)
    @PostMapping("/booking")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Please login first");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            Booking booking = bookingService.createBooking(request, user);
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("message", "Booking created successfully");
            successResponse.put("bookingId", booking.getBookingID());
            return ResponseEntity.ok(successResponse);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // 2. Get Cart (Pending Bookings)
    @GetMapping("/cart")
    public ResponseEntity<?> getCart(HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // Return latest pending booking or all
        return ResponseEntity.ok(bookingService.getLatestPendingBooking(user));
    }

    // 3. Update Guest Details (Name, DOB, Gender)
    @PutMapping("/booking/{bookingId}/details")
    public ResponseEntity<?> updateBookingDetails(@PathVariable String bookingId,
            @RequestBody Map<String, Object> details) {
        try {
            String nama = (String) details.get("nama");
            String note = (String) details.get("note"); // New field

            Booking booking = bookingService.updateBookingDetails(bookingId, nama, note);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. Process Payment
    @PutMapping("/booking/{bookingId}/pay")
    public ResponseEntity<?> processPayment(@PathVariable String bookingId,
            @RequestBody Map<String, Object> paymentData) {
        try {
            Double amount = Double.valueOf(paymentData.get("amount").toString());
            String method = (String) paymentData.getOrDefault("method", "QRIS");

            Booking booking = bookingService.processPayment(bookingId, amount, method);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
