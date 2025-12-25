package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.Reservasi;
import com.pbo.tubes.hotel_booking.service.KamarService;
import com.pbo.tubes.hotel_booking.service.ReservasiService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/reservasi")
public class ReservasiController {

    private final KamarService kamarService;
    private final ReservasiService reservasiService;

    public ReservasiController(KamarService kamarService,
                               ReservasiService reservasiService) {
        this.kamarService = kamarService;
        this.reservasiService = reservasiService;
    }

    @GetMapping("/{kamarId}")
    public String form(@PathVariable Long kamarId, Model model) {
        Kamar kamar = kamarService.findById(kamarId);

        Reservasi reservasi = new Reservasi();
        reservasi.setKamar(kamar);

        model.addAttribute("reservasi", reservasi);
        return "reservasi/form";
    }

    @PostMapping("/simpan")
    public String simpan(@ModelAttribute Reservasi reservasi, Model model) {

        boolean tersedia = reservasiService.kamarTersedia(
                reservasi.getKamar().getId(),
                reservasi.getCheckIn(),
                reservasi.getCheckOut()
        );

        if (!tersedia) {
            model.addAttribute("error", "Kamar tidak tersedia pada tanggal tersebut");
            return "reservasi/form";
        }

        reservasiService.simpanReservasi(reservasi);
        return "reservasi/sukses";
    }
}
