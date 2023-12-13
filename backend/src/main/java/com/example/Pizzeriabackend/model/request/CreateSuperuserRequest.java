package com.example.Pizzeriabackend.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CreateSuperuserRequest {
    private String name;
    private String surname;
    private String email;
    private String oldPassword;
    private String password;
}
