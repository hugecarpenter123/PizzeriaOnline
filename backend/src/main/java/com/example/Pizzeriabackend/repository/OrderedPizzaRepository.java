package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.OrderedPizza;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderedPizzaRepository extends JpaRepository<OrderedPizza, Long> {
}
