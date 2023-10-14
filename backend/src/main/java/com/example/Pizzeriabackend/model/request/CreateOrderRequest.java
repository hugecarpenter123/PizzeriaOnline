package com.example.Pizzeriabackend.model.request;

import com.example.Pizzeriabackend.entity.enums.OrderType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CreateOrderRequest {
    private String ordererName;
    private List<OrderedPizzaModel> orderedPizzas;
    private List<OrderedDrinkModel> orderedDrinks;
    private OrderType orderType;
    private String deliveryAddress;
    private String phone;
}
