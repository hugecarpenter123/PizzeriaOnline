package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.repository.DrinkRepository;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MenuService {
    @Autowired
    private DrinkRepository drinkRepository;

    @Autowired
    private PizzaService pizzaService;
    @Autowired
    private DrinksService drinksService;

    public Map<String, Object> getMenu() {
        Map<String, Object> menu = new HashMap<>();
        menu.put("pizzaList", pizzaService.getAllPizzas());
        menu.put("drinkList", drinksService.getAllDrinks());
        return menu;
    }
}
