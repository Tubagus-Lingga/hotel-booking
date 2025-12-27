package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.Reservasi;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.repository.UserRepository;
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

    public AdminApiController(KamarService kamarService, ReservasiService reservasiService,
            UserRepository userRepository) {
        this.kamarService = kamarService;
        this.reservasiService = reservasiService;
        this.userRepository = userRepository;
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

    @GetMapping("/reservasi")
    public ResponseEntity<List<Reservasi>> getAllReservasi() {
        return ResponseEntity.ok(reservasiService.getAllReservasi());
    }

    // ================= CUSTOMERS (USERS) =================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllCustomers() {
        // Return only customers
        return ResponseEntity.ok(userRepository.findByRole("PELANGGAN"));
    }

    // ================= DASHBOARD STATS =================

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalKamar = kamarService.getAllKamar().size();
        long totalReservasi = reservasiService.getAllReservasi().size();
        long totalPelanggan = userRepository.findByRole("PELANGGAN").size();

        // Simple Revenue Calculation
        double totalRevenue = reservasiService.getAllReservasi().stream()
                .mapToDouble(r -> r.getKamar().getHarga()) // Assuming 1 night for simplicity, or we can improve logic
                .sum();

        stats.put("totalKamar", totalKamar);
        stats.put("totalReservasi", totalReservasi);
        stats.put("totalPelanggan", totalPelanggan);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }
}
