package com.example.Pizzeriabackend.service;


import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.model.DTO.PizzaDTO;
import com.example.Pizzeriabackend.model.PizzaModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PizzaService {
    List<Pizza> getAllPizzas();
    Pizza getPizza(Long id);
    PizzaDTO createPizza(MultipartFile image, String pizzaModel);
    void deletePizza(Long id);

    PizzaDTO getPizzaWithReviews(Long id);
    List<PizzaDTO> getAllPizzas2();
    List<PizzaDTO> getAllPizzas3();
}
