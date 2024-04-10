package com.example.Pizzeriabackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
