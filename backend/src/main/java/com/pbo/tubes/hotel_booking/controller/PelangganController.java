package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Kamar;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.service.KamarService;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/customer")
public class PelangganController {

    private final KamarService kamarService;

    public PelangganController(KamarService kamarService) {
        this.kamarService = kamarService;
    }

    @GetMapping("/dashboard")
    public String dashboard(Model model, HttpSession session) {
        User user = (User) session.getAttribute("loginUser");

        if (user == null) {
            return "redirect:/login";
        }

        List<Kamar> kamarList = kamarService.getAllKamar(); // or getKamarTersedia()
        model.addAttribute("kamarList", kamarList);

        return "customer/dashboard";
    }

    // 🔥 INI YANG KAMU BUTUHKAN
    @GetMapping("/kamar")
    public String lihatKamarTersedia(Model model, HttpSession session) {
        User user = (User) session.getAttribute("loginUser");

        if (user == null) {
            return "redirect:/login";
        }

        List<Kamar> kamarTersedia = kamarService.getKamarTersedia();
        model.addAttribute("kamars", kamarTersedia);

        return "customer/kamar";
    }
}
