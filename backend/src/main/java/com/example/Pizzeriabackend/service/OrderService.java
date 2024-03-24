package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.model.request.CreateOrderRequest;
import com.example.Pizzeriabackend.model.request.OrderStatusRequest;

import java.util.List;

public interface OrderService {
    OrderDTO createOrder(CreateOrderRequest createOrderRequest);
    OrderDTO getOrder(long id);
    List<OrderDTO> getMyOrders();
    void deleteOrder(long id);
    void cancelOrder(long id);
    void deleteAllOrders();
    List<OrderDTO> getAllOrders();
    List<OrderDTO> getUserOrders(long id);
    void updateOrderStatus(OrderStatusRequest orderStatusModel);
    OrderDTO getOrderByLookupId(String lookupId);
    List<OrderDTO> getUnfinishedOrders();

}
