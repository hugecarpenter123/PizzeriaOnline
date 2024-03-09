package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.entity.Role;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseService {
    void pushOrderNotification(Order order);
    SseEmitter orderSubscription(Long id);
}
