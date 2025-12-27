package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.service.KamarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

    private final KamarService kamarService;

    public PublicApiController(KamarService kamarService) {
        this.kamarService = kamarService;
    }

    @GetMapping("/kamar")
    public ResponseEntity<List<Kamar>> getAllKamar() {
        // Return all rooms as JSON
        List<Kamar> kamars = kamarService.getAllKamar();
        if (kamars.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(kamars);
    }

    @GetMapping("/kamar/tersedia")
    public ResponseEntity<List<Kamar>> getKamarTersedia() {
        List<Kamar> kamars = kamarService.getKamarTersedia();
        return ResponseEntity.ok(kamars);
    }
}
