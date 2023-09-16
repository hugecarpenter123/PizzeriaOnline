package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.model.DTO.OrderDTO;
import com.example.Pizzeriabackend.model.OrderModel;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(OrderModel orderModel);
    Order getOrder(long id);
    List<Order> getOrders();
    void deleteOrder(long id);
    void cancelOrder(long id);
    void deleteAllOrders();
}
