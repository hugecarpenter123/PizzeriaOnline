package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.config.JWT.model.AuthenticationRequest;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.config.JWT.model.RefreshTokenRequest;
import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.model.DTO.OrderDTO;
import com.example.Pizzeriabackend.model.DTO.UserDetailsDTO;
import com.example.Pizzeriabackend.model.OrderModel;
import com.example.Pizzeriabackend.model.UserModel;
import com.example.Pizzeriabackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/getToken")
    public ResponseEntity<AuthenticationResponse> getToken(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(userService.loginUser(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody UserModel userModel) {
        userService.registerUser(userModel);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String, UserDetailsDTO>> getUserDetails() {
        UserDetailsDTO userDetails = userService.getDetails();
        return ResponseEntity.ok(Map.of("result", userDetails));
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updateUser(@RequestBody UserModel userModel) {
        UserDetailsDTO userDetails = userService.updateUser(userModel);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getOrders")
    public ResponseEntity<Map<String, List<OrderDTO>>> getOrders() {
        List<OrderDTO> orders = userService.getUserOrders();
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser() {
        userService.deleteUser();
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "image-update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadImage(@RequestParam MultipartFile image) {
        userService.saveUserImage(image);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<AuthenticationResponse> refreshToken(RefreshTokenRequest request) {
        AuthenticationResponse response = jwtService.refreshToken(request);
        return ResponseEntity.ok(response);
    }


}
