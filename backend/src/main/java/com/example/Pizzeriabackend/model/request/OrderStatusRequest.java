package com.example.Pizzeriabackend.model.request;

import com.example.Pizzeriabackend.entity.enums.OrderStatus;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.EnumSet;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusRequest {
    private Long orderId;
    private OrderStatus orderStatus;
    @Hidden
    public boolean isValid() {
        return EnumSet.of(OrderStatus.PENDING, OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED, OrderStatus.CANCELLED).contains(orderStatus);
    }
}
