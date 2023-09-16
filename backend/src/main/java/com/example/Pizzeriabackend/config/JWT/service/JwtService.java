package com.example.Pizzeriabackend.config.JWT.service;

import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.config.JWT.model.RefreshTokenRequest;
import com.example.Pizzeriabackend.entity.RefreshToken;
import com.example.Pizzeriabackend.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {
    String extractUsername(String token);

    String generateToken(Map<String, Object> extraClaims, UserDetails userDetails);

    String generateToken(UserDetails userDetails);

    boolean isTokenValid(String token);

    RefreshToken generateRefreshToken(User user);

    AuthenticationResponse refreshToken(RefreshTokenRequest requestModel);
}
