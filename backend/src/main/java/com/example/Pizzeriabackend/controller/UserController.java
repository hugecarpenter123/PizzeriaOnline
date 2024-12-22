package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.config.JWT.model.AuthenticationRequest;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.config.JWT.model.RefreshTokenRequest;
import com.example.Pizzeriabackend.config.JWT.model.RefreshTokenResponse;
import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.event.registration.RegistrationEvent;
import com.example.Pizzeriabackend.model.request.CreateSuperuserRequest;
import com.example.Pizzeriabackend.model.request.EmailRequest;
import com.example.Pizzeriabackend.model.request.UserDetailsRequest;
import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.model.response.UserDetailsDTO;
import com.example.Pizzeriabackend.service.OrderService;
import com.example.Pizzeriabackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> getToken(@RequestBody AuthenticationRequest request) {
        System.out.println("request:" + request);
        return ResponseEntity.ok(userService.loginUser(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserDetailsRequest userDetailsRequest) {
        userService.registerUser(userDetailsRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String, UserDetailsDTO>> getUserDetails() {
        UserDetailsDTO userDetails = userService.getMyDetails();
        return ResponseEntity.ok(Map.of("result", userDetails));
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, UserDetailsDTO>> updateUser(@RequestBody UserDetailsRequest userDetailsRequest) {
        UserDetailsDTO userDetails = userService.updateUser(userDetailsRequest);
        return ResponseEntity.ok(Map.of("result", userDetails));
    }

    @GetMapping("/orders")
    public ResponseEntity<Map<String, List<OrderDTO>>> getOrders() {
        List<OrderDTO> orders = orderService.getMyOrders();
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser() {
        userService.deleteUser();
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/image-update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadImage(@RequestParam MultipartFile image) {
        userService.saveUserImage(image);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = jwtService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    // admin only ------------------------------------------
    @PostMapping("/super-user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> createSuperUser(@RequestBody CreateSuperuserRequest createSuperuserRequest) {
        userService.createSuperUser(createSuperuserRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-email")
    public ResponseEntity<Void> sendEmail(@RequestBody EmailRequest emailRequest) {
        applicationEventPublisher.publishEvent(new RegistrationEvent(this, emailRequest.getTo(), emailRequest.getUsername()));
        return ResponseEntity.ok().build();
    }

}
