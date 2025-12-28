package com.pbo.tubes.hotel_booking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/resepsionis")
public class ResepsionisController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "resepsionis/dashboard";
    }
}

