package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.dto.BookingRequest;
import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.Reservasi;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.service.KamarService;
import com.pbo.tubes.hotel_booking.service.ReservasiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerApiController {

    private final KamarService kamarService;
    private final ReservasiService reservasiService;

    public CustomerApiController(KamarService kamarService, ReservasiService reservasiService) {
        this.kamarService = kamarService;
        this.reservasiService = reservasiService;
    }

    @PostMapping("/booking")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, HttpSession session) {
        // Authenticate user from session (or token in future)
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Please login first");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Check availability
        boolean tersedia = reservasiService.kamarTersedia(
                request.getKamarId(),
                request.getCheckIn(),
                request.getCheckOut());

        if (!tersedia) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Room not available for selected dates");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // Create Reservation
        Kamar kamar = kamarService.findById(request.getKamarId());
        if (kamar == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Room not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Reservasi reservasi = new Reservasi();
        reservasi.setKamar(kamar);
        reservasi.setNamaPemesan(request.getNamaPemesan());
        reservasi.setCheckIn(request.getCheckIn());
        reservasi.setCheckOut(request.getCheckOut());
        reservasi.setTipeKasur(request.getTipeKasur());
        reservasi.setSarapan(request.isSarapan());

        reservasiService.simpanReservasi(reservasi);

        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("message", "Booking successful");
        successResponse.put("bookingId", reservasi.getId());
        return ResponseEntity.ok(successResponse);
    }
}
