package com.example.Pizzeriabackend.model;

import com.example.Pizzeriabackend.entity.enums.PizzaSizes;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderedPizzaModel {
    private Long pizzaId;
    private PizzaSizes size;
    private int quantity;
}
