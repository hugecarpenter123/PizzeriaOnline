package com.example.Pizzeriabackend.model.DTO;

import com.example.Pizzeriabackend.entity.PizzaSizes;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderedPizzaDto {
    private String imageUrl;
    private String name;
    private String size;
    private int quantity;
}
