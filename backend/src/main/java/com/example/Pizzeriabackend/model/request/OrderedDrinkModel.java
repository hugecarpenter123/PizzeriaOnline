package com.example.Pizzeriabackend.model.request;

import com.example.Pizzeriabackend.entity.enums.DrinkSizes;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderedDrinkModel {
    private Long drinkId;
    private int quantity;
    private DrinkSizes size;
}
