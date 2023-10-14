package com.example.Pizzeriabackend.entity;

import com.example.Pizzeriabackend.entity.enums.DrinkSizes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Drink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;
    private String imageUrl = "http://192.168.1.39:8082/images/drink-images/drink-default.jpg";

    public double getPrice(DrinkSizes size) {
        return switch (size) {
            case SMALL_330 -> smallSizePrice;
            case MEDIUM_500 -> mediumSizePrice;
            case BIG_1000 -> bigSizePrice;
            default -> 0.0;
        };
    }

}