package com.example.Pizzeriabackend.model;

import com.example.Pizzeriabackend.util.DateDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserModel {
    private String name;
    private String surname;
    private String email;
    private String oldPassword;
    private String password;
    private String city;
    private String cityCode;
    private String street;
    private String houseNumber;
    private String phoneNumber;
    private String dateOfBirth;
}
