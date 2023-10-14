package com.example.Pizzeriabackend.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDrinkRequest {
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;
}
