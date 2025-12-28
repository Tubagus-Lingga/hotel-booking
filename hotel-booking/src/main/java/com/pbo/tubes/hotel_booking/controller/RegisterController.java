package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Role;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.service.UserService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class RegisterController {

    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String prosesRegister(@ModelAttribute User user) {

        user.setRole(Role.PELANGGAN);
        userService.save(user);

        return "redirect:/login";
    }
}
