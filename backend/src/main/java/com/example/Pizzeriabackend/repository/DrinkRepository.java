package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.Drink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DrinkRepository extends JpaRepository<Drink, Long> {
}
