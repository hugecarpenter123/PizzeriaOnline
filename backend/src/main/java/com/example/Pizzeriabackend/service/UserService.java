package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.config.JWT.model.AuthenticationRequest;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.model.DTO.OrderDTO;
import com.example.Pizzeriabackend.model.DTO.UserDetailsDTO;
import com.example.Pizzeriabackend.model.UserModel;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    void registerUser(UserModel userModel);
    void createSuperUser(UserModel userModel);
    AuthenticationResponse loginUser(AuthenticationRequest request);
    UserDetailsDTO getDetails(Authentication authentication);
    List<OrderDTO> getUserOrders(Authentication authentication);
    void deleteUser();
    void saveUserImage(MultipartFile image);

    UserDetailsDTO updateUser(UserModel userModel);
}