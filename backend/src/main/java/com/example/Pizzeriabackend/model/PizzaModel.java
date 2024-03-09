package com.example.Pizzeriabackend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PizzaModel {
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;
    private List<Long> ingredientIds;
}
