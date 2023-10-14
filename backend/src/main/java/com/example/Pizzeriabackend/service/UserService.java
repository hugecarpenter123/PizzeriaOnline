package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.config.JWT.model.AuthenticationRequest;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.model.response.UserDetailsDTO;
import com.example.Pizzeriabackend.model.request.CreateSuperuserRequest;
import com.example.Pizzeriabackend.model.request.UserDetailsRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    void registerUser(UserDetailsRequest userDetailsRequest);
    void createSuperUser(CreateSuperuserRequest createSuperuserRequest);
    AuthenticationResponse loginUser(AuthenticationRequest request);
    UserDetailsDTO getDetails();
    List<OrderDTO> getUserOrders();
    void deleteUser();
    void saveUserImage(MultipartFile image);

    UserDetailsDTO updateUser(UserDetailsRequest userDetailsRequest);
}