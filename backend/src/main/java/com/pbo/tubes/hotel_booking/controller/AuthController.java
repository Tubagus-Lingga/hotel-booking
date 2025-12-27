package com.pbo.tubes.hotel_booking.controller;

import com.pbo.tubes.hotel_booking.model.Role;
import com.pbo.tubes.hotel_booking.model.User;
import com.pbo.tubes.hotel_booking.service.CustomerService;
import com.pbo.tubes.hotel_booking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final CustomerService customerService;

    public AuthController(UserService userService, CustomerService customerService) {
        this.userService = userService;
        this.customerService = customerService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOpt = userService.loginByEmail(email, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            session.setAttribute("loginUser", user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("user", user);
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        try {
            String name = registerRequest.get("name");
            String email = registerRequest.get("email");
            String password = registerRequest.get("password");

            // Basic validation
            // Basic validation
            if (name == null || email == null || password == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Name, Email, and Password are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Check if email already exists
            if (userService.findByEmail(email).isPresent()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Email is already registered. Please login.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            // Create User manually since UserService doesn't have register method
            User newUser = new User();
            newUser.setUsername(email); // Use email as username
            newUser.setEmail(email);
            newUser.setPassword(password);
            newUser.setRole(Role.PELANGGAN);

            User savedUser = userService.save(newUser);

            // Create Customer record
            customerService.createCustomer(savedUser, name, "", "", email);

            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "Registration successful");
            return ResponseEntity.ok(successResponse);
        } catch (Exception e) {
            e.printStackTrace(); // PRINT ERROR TO CONSOLE
            System.out.println("REGISTRATION ERROR: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}
