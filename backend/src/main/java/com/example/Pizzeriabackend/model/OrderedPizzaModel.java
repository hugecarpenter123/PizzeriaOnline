package com.example.Pizzeriabackend.model;

import com.example.Pizzeriabackend.entity.PizzaSizes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
public class OrderedPizzaModel {
    private Long pizzaId;
    private PizzaSizes size;
    private int quantity;
}
