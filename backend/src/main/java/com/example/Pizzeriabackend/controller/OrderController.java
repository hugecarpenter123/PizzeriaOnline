package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.model.DTO.OrderDTO;
import com.example.Pizzeriabackend.model.OrderModel;
import com.example.Pizzeriabackend.repository.OrderRepository;
import com.example.Pizzeriabackend.service.OrderService;
import com.example.Pizzeriabackend.util.ResponseTemplate;
import jdk.javadoc.doclet.Reporter;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, OrderDTO>> createOrder(@RequestBody OrderModel orderModel) {
        OrderDTO order = orderService.createOrder(orderModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Order>> getOrder(@PathVariable long id) {
        Order order = orderService.getOrder(id);
        return ResponseTemplate.success(HttpStatus.OK, order);
    }

    @GetMapping
    public ResponseEntity<Map<String, List<Order>>> getOrders() {
        List<Order> orders = orderService.getOrders();
        return ResponseTemplate.success(HttpStatus.OK, orders);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteAllOrders() {
        orderService.deleteAllOrders();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable long id) {
        orderService.cancelOrder(id);
        return ResponseEntity.ok().build();
    }

}
