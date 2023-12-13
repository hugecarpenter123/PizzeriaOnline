package com.example.Pizzeriabackend.service;


import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.model.response.PizzaDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PizzaService {
    Pizza getPizza(Long id);
    PizzaDTO createPizza(MultipartFile image, String pizzaModel);
    void deletePizza(Long id);

    PizzaDTO getPizzaWithReviews(Long id);
    List<PizzaDTO> getAllPizzas();

    void deleteAllPizzas();
}
