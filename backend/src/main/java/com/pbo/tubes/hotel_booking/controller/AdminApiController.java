package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.Reservasi;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.repository.UserRepository;
import com.pbo.tubes.hotel_booking.service.BookingService;
import com.pbo.tubes.hotel_booking.service.KamarService;
import com.pbo.tubes.hotel_booking.service.ReservasiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Allow Next.js to access this
public class AdminApiController {

    private final KamarService kamarService;
    private final ReservasiService reservasiService;
    private final UserRepository userRepository;
    private final BookingService bookingService;
    private final com.pbo.tubes.hotel_booking.repository.BookingRepository bookingRepository;

    public AdminApiController(KamarService kamarService, ReservasiService reservasiService,
            UserRepository userRepository, BookingService bookingService,
            com.pbo.tubes.hotel_booking.repository.BookingRepository bookingRepository) {
        this.kamarService = kamarService;
        this.reservasiService = reservasiService;
        this.userRepository = userRepository;
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
    }

    // ================= KAMAR (ROOMS) =================

    @GetMapping("/kamar")
    public ResponseEntity<List<Kamar>> getAllKamar() {
        return ResponseEntity.ok(kamarService.getAllKamar());
    }

    @PostMapping("/kamar")
    public ResponseEntity<Kamar> createKamar(@RequestBody Kamar kamar) {
        kamarService.save(kamar);
        return ResponseEntity.ok(kamar);
    }

    @GetMapping("/kamar/{id}")
    public ResponseEntity<Kamar> getKamarById(@PathVariable Long id) {
        return ResponseEntity.ok(kamarService.findById(id));
    }

    @PutMapping("/kamar/{id}")
    public ResponseEntity<Kamar> updateKamar(@PathVariable Long id, @RequestBody Kamar kamarDetails) {
        Kamar kamar = kamarService.findById(id);

        kamar.setNomorKamar(kamarDetails.getNomorKamar());
        kamar.setTipe(kamarDetails.getTipe());
        kamar.setHarga(kamarDetails.getHarga());
        kamar.setStatusKamar(kamarDetails.getStatusKamar());
        kamar.setFasilitasTambahan(kamarDetails.getFasilitasTambahan());
        kamar.setGambar(kamarDetails.getGambar());

        kamarService.save(kamar);
        return ResponseEntity.ok(kamar);
    }

    @DeleteMapping("/kamar/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteKamar(@PathVariable Long id) {
        kamarService.delete(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    // ================= RESERVASI (BOOKINGS) =================

    // ================= RESERVASI (BOOKINGS) =================

    @GetMapping("/reservasi")
    public ResponseEntity<List<Reservasi>> getAllReservasi() {
        return ResponseEntity.ok(reservasiService.getAllReservasi());
    }

    // ================= REAL BOOKINGS (NEW) =================

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/bookings/{bookingId}/assign-room/{kamarId}")
    public ResponseEntity<Booking> assignRoom(@PathVariable String bookingId, @PathVariable Long kamarId) {
        Booking updatedBooking = bookingService.assignRoom(bookingId, kamarId);
        return ResponseEntity.ok(updatedBooking);
    }

    @PutMapping("/bookings/{bookingId}/update-dates")
    public ResponseEntity<Booking> updateBookingDates(@PathVariable String bookingId,
            @RequestBody Map<String, String> dates) {
        try {
            String checkIn = dates.get("checkIn");
            String checkOut = dates.get("checkOut");

            Booking updatedBooking = bookingService.updateBookingDates(bookingId, checkIn, checkOut);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ================= CUSTOMERS (USERS) =================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllCustomers() {
        // Return only customers
        return ResponseEntity.ok(userRepository.findByRole("PELANGGAN"));
    }

    // ================= DASHBOARD STATS =================

    // ================= UPLOAD IMAGE =================

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Empty file");
            }

            // Create uploads directory if not exists
            java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }

            // Generate filename unique
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path targetLocation = uploadDir.resolve(filename);

            // Copy file
            java.nio.file.Files.copy(file.getInputStream(), targetLocation,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Construct URL
            String fileUrl = "http://localhost:8081/uploads/" + filename;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to store file " + e.getMessage());
        }
    }

    // ================= DASHBOARD STATS =================

    @PostMapping("/fix-payment-amounts")
    public ResponseEntity<Map<String, Object>> fixPaymentAmounts() {
        Map<String, Object> result = new HashMap<>();
        int fixed = 0;

        try {
            List<Booking> bookings = bookingService.getAllBookings();

            for (Booking booking : bookings) {
                if (booking.getPayment() != null && booking.getKamar() != null) {
                    // Calculate correct amount based on room price and stay duration
                    long checkIn = booking.getTanggalCheckIn().getTime();
                    long checkOut = booking.getTanggalCheckOut().getTime();
                    long days = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

                    double correctAmount = booking.getKamar().getHarga() * days;
                    double currentAmount = booking.getPayment().getTotalPembayaran();

                    // Only update if amounts don't match
                    if (Math.abs(correctAmount - currentAmount) > 0.01) {
                        booking.getPayment().setTotalPembayaran(correctAmount);
                        bookingRepository.save(booking);
                        fixed++;
                    }
                }
            }

            result.put("success", true);
            result.put("fixed", fixed);
            result.put("message", "Fixed " + fixed + " payment amounts");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalKamar = kamarService.getAllKamar().size();

        // Use BookingService instead of ReservasiService
        List<Booking> bookings = bookingService.getAllBookings();
        long totalReservasi = bookings.size(); // Or filter by status 'Paid'/'Pending' if needed
        // long totalPelanggan = userRepository.findByRole("PELANGGAN").size();
        long totalPelanggan = 0; // Temporarily disabled due to Repository error

        // Calculate Revenue from Payments
        // Calculate Revenue from Payments (Safe Mode)
        double totalRevenue = 0;
        try {
            totalRevenue = bookings.stream()
                    .filter(b -> b.getPayment() != null)
                    .mapToDouble(b -> b.getPayment().getTotalPembayaran() != null ? b.getPayment().getTotalPembayaran()
                            : 0.0)
                    .sum();
        } catch (Exception e) {
            System.err.println("Error calculating revenue: " + e.getMessage());
        }

        stats.put("totalKamar", totalKamar);
        stats.put("totalReservasi", totalReservasi);
        stats.put("totalPelanggan", totalPelanggan);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }
}
