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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CustomerApiController {

    private final BookingService bookingService;

    public CustomerApiController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

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

    @DeleteMapping("/booking/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable String bookingId, HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
             bookingService.deleteBooking(bookingId);
             return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Booking deleted"));
        } catch (Exception e) {
             return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCart(HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(bookingService.getPendingBookings(user));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        

        
        java.util.List<Booking> all = bookingService.getBookingsByUser(user);
        


        java.util.List<Booking> history = all.stream()
                .filter(b -> !"Pending".equals(b.getStatusPembayaran()))
                .sorted((b1, b2) -> b2.getBookingID().compareTo(b1.getBookingID()))
                .collect(java.util.stream.Collectors.toList());
                
        return ResponseEntity.ok(history);
    }

    @PutMapping("/booking/{bookingId}/details")
    public ResponseEntity<?> updateBookingDetails(@PathVariable String bookingId,
            @RequestBody Map<String, Object> details) {
        try {
            String nama = (String) details.get("nama");
            String note = (String) details.get("note");

            Booking booking = bookingService.updateBookingDetails(bookingId, nama, note);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/booking/pay")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Double amount = Double.valueOf(paymentData.get("amount").toString());
            String method = (String) paymentData.getOrDefault("method", "QRIS");
            
            if (paymentData.containsKey("bookingIds")) {
                java.util.List<String> ids = (java.util.List<String>) paymentData.get("bookingIds");
                bookingService.processGroupPayment(ids, amount, method);
                return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Payment for " + ids.size() + " bookings successful"));
            } else if (paymentData.containsKey("bookingId")) {
                 String bookingId = (String) paymentData.get("bookingId");
                 Booking b = bookingService.processPayment(bookingId, amount, method);
                 return ResponseEntity.ok(b);
            }
            
            return ResponseEntity.badRequest().body("bookingIds or bookingId required");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
