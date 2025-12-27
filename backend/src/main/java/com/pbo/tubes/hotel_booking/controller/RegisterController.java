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

    public RegisterController(UserService userService, CustomerService customerService) {
        this.userService = userService;
        this.customerService = customerService;
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
            @RequestParam(required = false) String alamat,
            @RequestParam(required = false) String telepon,
            Model model) {

        // Check if email already exists
        if (userService.findByEmail(email).isPresent()) {
            model.addAttribute("error", "Email sudah terdaftar");
            return "register";
        }

        // Create User
        User user = new User();
        user.setEmail(email);
        user.setUsername(email); // Use email as username
        user.setPassword(password); // TODO: Add password hashing with BCrypt
        user.setRole(Role.PELANGGAN);

        User savedUser = userService.save(user);

        // Create Customer
        customerService.createCustomer(
                savedUser,
                nama,
                alamat != null ? alamat : "",
                telepon != null ? telepon : "",
                email);

        return "redirect:/login?registered=true";
    }
}
