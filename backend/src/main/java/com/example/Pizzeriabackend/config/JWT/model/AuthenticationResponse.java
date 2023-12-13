package com.example.Pizzeriabackend.config.JWT.model;

import com.example.Pizzeriabackend.model.response.UserDetailsDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthenticationResponse {
    private String token;
    private String refreshToken;
    private UserDetailsDTO userDetails;
}
