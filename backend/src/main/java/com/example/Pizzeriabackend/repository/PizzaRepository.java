package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.model.DTO.PizzaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PizzaRepository extends JpaRepository<Pizza, Long> {
}
