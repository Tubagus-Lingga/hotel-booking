package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Role;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.service.UserService;
import com.pbo.tubes.hotel_booking.service.CustomerService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class RegisterController {

    private final UserService userService;
    private final CustomerService customerService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public RegisterController(UserService userService, CustomerService customerService, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.customerService = customerService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String prosesRegister(
            @RequestParam String nama,
            @RequestParam String email,
            @RequestParam String password,

            Model model) {

        if (userService.findByEmail(email).isPresent()) {
            model.addAttribute("error", "Email sudah terdaftar");
            return "register";
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.PELANGGAN);

        User savedUser = userService.save(user);

        customerService.createCustomer(
                savedUser,
                nama,
                email);

        return "redirect:/login?registered=true";
    }
}
