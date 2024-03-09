package com.example.Pizzeriabackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrinkModel {
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;
}
