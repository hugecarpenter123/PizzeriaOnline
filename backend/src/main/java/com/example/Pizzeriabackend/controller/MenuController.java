package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.entity.Drink;
import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.response.DrinkDTO;
import com.example.Pizzeriabackend.model.response.PizzaDTO;
import com.example.Pizzeriabackend.model.request.CreateIngredientRequest;
import com.example.Pizzeriabackend.service.DrinksService;
import com.example.Pizzeriabackend.service.IngredientService;
import com.example.Pizzeriabackend.service.MenuService;
import com.example.Pizzeriabackend.service.PizzaService;
import com.example.Pizzeriabackend.util.ResponseTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    @Autowired
    private MenuService menuService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMenu() {
        return ResponseEntity.ok().body(menuService.getMenu());
    }
}
