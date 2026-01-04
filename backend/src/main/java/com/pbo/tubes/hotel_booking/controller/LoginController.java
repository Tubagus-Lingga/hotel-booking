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
            @RequestParam String email,
            @RequestParam String password,
            Model model,
            HttpSession session) {

        // Try login with email
        Optional<User> userOpt = userService.loginByEmail(email, password);

        if (!userOpt.isPresent()) {
            model.addAttribute("error", "Email atau password salah");
            return "login";
        }

        User user = userOpt.get();

        // Save user to session
        session.setAttribute("loginUser", user);
        session.setAttribute("userId", user.getId());

        if (user.getRole() == Role.ADMIN) {
            return "redirect:/admin/dashboard";

        } else {
            return "redirect:/customer/dashboard";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login?logout=true";
    }

}
