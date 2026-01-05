package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Booking;
import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.Role;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.repository.UserRepository;
import com.pbo.tubes.hotel_booking.service.BookingService;
import com.pbo.tubes.hotel_booking.service.KamarService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminApiController {

    private final KamarService kamarService;
    private final UserRepository userRepository;
    private final BookingService bookingService;
    private final com.pbo.tubes.hotel_booking.repository.BookingRepository bookingRepository;

    public AdminApiController(KamarService kamarService,
            UserRepository userRepository, BookingService bookingService,
            com.pbo.tubes.hotel_booking.repository.BookingRepository bookingRepository) {
        this.kamarService = kamarService;
        this.userRepository = userRepository;
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
    }

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
    public ResponseEntity<?> deleteKamar(@PathVariable Long id) {
        try {
            kamarService.delete(id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", Boolean.TRUE);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

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

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllCustomers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.CUSTOMER));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Empty file");
            }

            java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            java.nio.file.Path targetLocation = uploadDir.resolve(filename);

            java.nio.file.Files.copy(file.getInputStream(), targetLocation,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://localhost:8081/uploads/" + filename;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to store file " + e.getMessage());
        }
    }

    @PostMapping("/fix-payment-amounts")
    public ResponseEntity<Map<String, Object>> fixPaymentAmounts() {
        Map<String, Object> result = new HashMap<>();
        int fixed = 0;

        try {
            List<Booking> bookings = bookingService.getAllBookings();

            for (Booking booking : bookings) {
                if (booking.getPayment() != null && booking.getKamar() != null) {
                    long checkIn = booking.getTanggalCheckIn().getTime();
                    long checkOut = booking.getTanggalCheckOut().getTime();
                    long days = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

                    double correctAmount = booking.getKamar().getHarga() * days;
                    double currentAmount = booking.getPayment().getTotalPembayaran();

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
        try {
            long totalKamar = kamarService.getAllKamar().size();
            List<Booking> bookings = bookingService.getAllBookings();
            long totalReservasi = bookings.size();
            long totalPelanggan = userRepository.findByRole(Role.CUSTOMER).size();

            double totalRevenue = 0;
            totalRevenue = bookings.stream()
                    .filter(b -> b.getPayment() != null)
                    .mapToDouble(b -> b.getPayment().getTotalPembayaran() != null ? b.getPayment().getTotalPembayaran()
                            : 0.0)
                    .sum();

            stats.put("totalKamar", totalKamar);
            stats.put("totalReservasi", totalReservasi);
            stats.put("totalPelanggan", totalPelanggan);
            stats.put("totalRevenue", totalRevenue);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Dashboard stats error: " + e.getMessage());
            e.printStackTrace();
            stats.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(stats);
        }
    }

    @DeleteMapping("/delete-all-data")
    public ResponseEntity<Map<String, Object>> deleteAllData() {
        Map<String, Object> result = new HashMap<>();
        try {
            bookingService.deleteAllData();
            result.put("success", true);
            result.put("message", "Semua data booking dan kamar berhasil dikosongkan.");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @PostMapping("/hash-passwords")
    public ResponseEntity<Map<String, Object>> hashAllPasswords() {
        Map<String, Object> result = new HashMap<>();
        try {
            org.springframework.security.crypto.password.PasswordEncoder encoder = 
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
            
            java.util.List<com.pbo.tubes.hotel_booking.model.User> allUsers = userRepository.findAll();
            int hashed = 0;
            
            for (com.pbo.tubes.hotel_booking.model.User user : allUsers) {
                String currentPassword = user.getPassword();
                // Check if password is not already hashed (BCrypt hash starts with $2a$, $2b$, or $2y$)
                if (!currentPassword.startsWith("$2a$") && !currentPassword.startsWith("$2b$") && !currentPassword.startsWith("$2y$")) {
                    user.setPassword(encoder.encode(currentPassword));
                    userRepository.save(user);
                    hashed++;
                }
            }
            
            result.put("success", true);
            result.put("hashed", hashed);
            result.put("total", allUsers.size());
            result.put("message", "Successfully hashed " + hashed + " passwords out of " + allUsers.size() + " users");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}
