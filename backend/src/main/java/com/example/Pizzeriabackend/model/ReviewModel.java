package com.example.Pizzeriabackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewModel {
    private Long pizzaId;
    private double stars;
    private String content;
}
