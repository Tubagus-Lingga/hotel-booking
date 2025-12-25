package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Role;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.service.UserService;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
public class LoginController {

    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String doLogin(
            @RequestParam String username,
            @RequestParam String password,
            Model model,
            HttpSession session) {
        Optional<User> userOpt = userService.login(username, password);

        if (!userOpt.isPresent()) {
            model.addAttribute("error", "Username atau password salah");
            return "login";
        }

        User user = userOpt.get();

        // 🔥 SIMPAN USER KE SESSION
        session.setAttribute("loginUser", user);

        if (user.getRole() == Role.ADMIN) {
            return "redirect:/admin/dashboard";
        } else if (user.getRole() == Role.RESEPSIONIS) {
            return "redirect:/resepsionis/dashboard";
        } else {
            return "redirect:/pelanggan/dashboard";
        }
    }

}
