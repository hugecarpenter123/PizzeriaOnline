package com.example.Pizzeriabackend.model.response;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.entity.OrderedDrink;
import com.example.Pizzeriabackend.entity.OrderedPizza;
import com.example.Pizzeriabackend.entity.enums.OrderStatus;
import com.example.Pizzeriabackend.entity.enums.OrderType;
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
    private long orderId;
    private String lookupId;
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
        this.orderId = order.getId();
        this.lookupId = order.getLookupId();
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
