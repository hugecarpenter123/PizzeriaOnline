package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.model.request.OrderStatusRequest;
import com.example.Pizzeriabackend.model.request.CreateOrderRequest;
import com.example.Pizzeriabackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Map<String, OrderDTO>> createOrder(@RequestBody CreateOrderRequest createOrderRequest) {
        OrderDTO order = orderService.createOrder(createOrderRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", order));
    }

    @GetMapping
    public ResponseEntity<Map<String, List<OrderDTO>>> getMyOrders() {
        List<OrderDTO> orders = orderService.getMyOrders();
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{lookupId}")
    public ResponseEntity<Map<String,OrderDTO>> getOrderByLookupId(@PathVariable String lookupId) {
        OrderDTO order = orderService.getOrderByLookupId(lookupId);
        return ResponseEntity.ok(Map.of("result", order));
    }

    // admin required -----------------------------
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping
    public ResponseEntity<Void> deleteAllOrders() {
        orderService.deleteAllOrders();
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    // worker required ----------------------------
    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @GetMapping("/all")
    public ResponseEntity<Map<String, List<OrderDTO>>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, OrderDTO>> getOrder(@PathVariable long id) {
        OrderDTO order = orderService.getOrder(id);
        return ResponseEntity.ok(Map.of("result", order));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, List<OrderDTO>>> getUserOrders(@PathVariable long userId) {
        List<OrderDTO> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(Map.of("result", orders));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'WORKER')")
    @PutMapping("/status")
    public ResponseEntity<Void> updateOrderStatus(@RequestBody OrderStatusRequest orderStatusModel) {
        orderService.updateOrderStatus(orderStatusModel);
        return ResponseEntity.ok().build();
    }

}
