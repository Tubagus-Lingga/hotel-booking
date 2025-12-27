package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.service.KamarService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class KamarController {

    private final KamarService kamarService;

    public KamarController(KamarService kamarService) {
        this.kamarService = kamarService;
    }

    // 🔹 UNTUK PELANGGAN LIHAT KAMAR TERSEDIA
    @GetMapping("/kamar")
    public String kamarTersedia(Model model) {
        model.addAttribute(
            "listKamar",
            kamarService.getKamarTersedia()
        );
        return "kamar/index";
    }
}
