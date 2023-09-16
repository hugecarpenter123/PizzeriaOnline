package com.example.Pizzeriabackend.model.DTO;

import com.example.Pizzeriabackend.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private long order_id;
    private String ordererName;
    private List<OrderedPizzaDto> orderedPizzas;
    private List<OrderedDrinkDto> orderedDrinks;
    private String deliveryAddress;
    private String phone;
    private OrderStatus orderStatus;
    private OrderType orderType;
    private LocalDateTime createdAt;
    private double total;

    public OrderDTO(Order order) {
        this.order_id = order.getId();
        this.ordererName = order.getOrdererName();
        this.orderedPizzas = getOrderedPizzaDtoList(order.getOrderedPizzas());
        this.orderedDrinks = getOrderedDrinkDtoList(order.getOrderedDrinks());
        this.deliveryAddress = order.getDeliveryAddress();
        this.orderStatus = order.getStatus();
        this.orderType = order.getOrderType();
        this.phone = order.getPhone();
        this.createdAt = order.getCreatedAt();
        this.total = calcTotal(order);
    }

    private double calcTotal(Order order) {
        return order.getOrderedPizzas().stream().mapToDouble(OrderedPizza::getTotalPrice).reduce(0.0, Double::sum)
        + order.getOrderedDrinks().stream().mapToDouble(OrderedDrink::getTotalPrice).reduce(0.0, Double::sum);
    }

    private List<OrderedPizzaDto> getOrderedPizzaDtoList(List<OrderedPizza> orderedPizzaList) {
        return orderedPizzaList.stream()
                .map(orderedPizza -> OrderedPizzaDto.builder()
                        .imageUrl(orderedPizza.getPizza().getImageUrl())
                        .name(orderedPizza.getPizza().getName())
                        .size(orderedPizza.getSize().name())
                        .quantity(orderedPizza.getQuantity())
                        .build()).toList();
    }

    private List<OrderedDrinkDto> getOrderedDrinkDtoList(List<OrderedDrink> orderedDrinkList) {
        return orderedDrinkList
                .stream()
                .map(orderedDrink -> OrderedDrinkDto.builder()
                        .imageUrl(orderedDrink.getDrink().getImageUrl())
                        .name(orderedDrink.getDrink().getName())
                        .size(orderedDrink.getSize().getDisplayName())
                        .quantity(orderedDrink.getQuantity())
                        .build())
                .toList();
    }
}
