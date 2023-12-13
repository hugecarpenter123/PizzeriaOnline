package com.example.Pizzeriabackend.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewRequest {
    private Long pizzaId;
    private double stars;
    private String content;
}
