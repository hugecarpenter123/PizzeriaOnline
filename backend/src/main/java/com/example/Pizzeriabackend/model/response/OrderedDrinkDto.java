package com.example.Pizzeriabackend.model.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderedDrinkDto {
    private String imageUrl;
    private String name;
    private String size;
    private int quantity;
}
