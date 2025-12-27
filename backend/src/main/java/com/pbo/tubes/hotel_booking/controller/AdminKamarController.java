package com.pbo.tubes.hotel_booking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.service.KamarService;

@Controller
@RequestMapping("/admin/kamar")
public class AdminKamarController {

    private final KamarService kamarService;

    public AdminKamarController(KamarService kamarService) {
        this.kamarService = kamarService;
    }

    @GetMapping
    public String index(Model model) {
        model.addAttribute("listKamar", kamarService.getAllKamar());
        return "admin/kamar/index";
    }

    @GetMapping("/tambah")
    public String tambah(Model model) {
        model.addAttribute("kamar", new Kamar());
        return "admin/kamar/form";
    }

    // 🔴 EDIT HARUS AMBIL DARI DB
    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        Kamar kamar = kamarService.findById(id);
        model.addAttribute("kamar", kamar);
        return "admin/kamar/form";
    }

    // 🔥 SIMPAN (INSERT / UPDATE)
    @PostMapping("/simpan")
    public String simpan(@ModelAttribute Kamar kamar) {
        kamarService.save(kamar);
        return "redirect:/admin/kamar";
    }

    @GetMapping("/hapus/{id}")
    public String hapus(@PathVariable Long id) {
        kamarService.delete(id);
        return "redirect:/admin/kamar";
    }
    
}
