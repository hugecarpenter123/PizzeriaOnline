package com.example.Pizzeriabackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrinkModel {
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;
}
