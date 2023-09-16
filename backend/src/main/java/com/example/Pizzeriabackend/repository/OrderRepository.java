package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
