package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.entity.Drink;
import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.model.DTO.DrinkDTO;
import com.example.Pizzeriabackend.model.DTO.PizzaDTO;
import com.example.Pizzeriabackend.model.DrinkModel;
import com.example.Pizzeriabackend.model.IngredientModel;
import com.example.Pizzeriabackend.model.PizzaModel;
import com.example.Pizzeriabackend.service.DrinksService;
import com.example.Pizzeriabackend.service.IngredientService;
import com.example.Pizzeriabackend.service.MenuService;
import com.example.Pizzeriabackend.service.PizzaService;
import com.example.Pizzeriabackend.util.ResponseTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.rsocket.context.RSocketPortInfoApplicationContextInitializer;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping(value = "/api/menu")
public class MenuController {

    @Autowired
    private PizzaService pizzaService;
    @Autowired
    private IngredientService ingredientService;
    @Autowired
    private MenuService menuService;
    @Autowired
    private DrinksService drinksService;

    @GetMapping("/pizza")
    public ResponseEntity<Map<String, List<Pizza>>> getAllPizzas() {
        return ResponseEntity.ok().body(Map.of("result", pizzaService.getAllPizzas()));
    }

    @GetMapping("/pizza-less")
    public ResponseEntity<Map<String, List<PizzaDTO>>> getAllPizzas2() {
//        return ResponseEntity.ok().body(Map.of("result", pizzaService.getAllPizzas2()));
        return ResponseEntity.ok().body(Map.of("result", pizzaService.getAllPizzas3()));
    }


    @GetMapping("/pizza/{id}")
    public ResponseEntity<Map<String, Pizza>> getPizza(@PathVariable("id") long id) {
        // TODO: 11.06.2023 maybe handle null pizza
        Pizza pizza = pizzaService.getPizza(id);
        if (pizza == null) return ResponseEntity.notFound().build();
//        return ResponseEntity.ok().body(Map.of("result", pizza));
        return ResponseTemplate.success(HttpStatus.OK, pizza);
    }

    @GetMapping("/pizza-less/{id}")
    public ResponseEntity<Map<String, PizzaDTO>> getPizzaDto(@PathVariable("id") long id) {
        return ResponseTemplate.success(HttpStatus.OK, pizzaService.getPizzaWithReviews(id));
    }

    @PostMapping("/pizza/create")
    public ResponseEntity<Map<String, PizzaDTO>> createPizza(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("pizzaModel") String pizzaModel) {
        PizzaDTO pizza = pizzaService.createPizza(image, pizzaModel);
        return ResponseEntity.ok().body(Map.of("result", pizza));
    }

    @DeleteMapping("/pizza/delete/{id}")
    public ResponseEntity<Void> deletePizza(@PathVariable long id) {
        return ResponseEntity.noContent().build();
    }

    // ingredient ------------------------------------------------------------------
    @PostMapping("/ingredient/create")
    public ResponseEntity<Map<String, Ingredient>> createIngredient(@RequestBody IngredientModel ingredientModel) {
        return ResponseEntity.ok().body(Map.of("result", ingredientService.createIngredient(ingredientModel)));
    }

    @GetMapping("/ingredient")
    public ResponseEntity<Map<String, List<Ingredient>>> getAllIngredients() {
        return ResponseEntity.ok().body(Map.of("result", ingredientService.getAllIngredients()));
    }

    // DRINKS ------------------------------------------------------------------
    @GetMapping("/drink")
    public ResponseEntity<Map<String, List<Drink>>> getAllDrinks() {
        return ResponseEntity.ok().body(Map.of("result", drinksService.getAllDrinks()));
    }

    @GetMapping("/drink/{id}")
    public ResponseEntity<Map<String, Drink>> getDrink(@PathVariable long id) {
        return ResponseEntity.ok().body(Map.of("result", drinksService.getDrink(id)));
    }

    @PostMapping("/drink/create")
    public ResponseEntity<Map<String, DrinkDTO>> createDrink(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("drinkModel") String jsonDrinkModel) {
        System.out.println("MenuController -> createDrink()");
        DrinkDTO drink = drinksService.createDrink(image, jsonDrinkModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", drink));
    }

    @DeleteMapping("/drink/delete/{id}")
    public ResponseEntity<Void> deleteDrink(@PathVariable long id) {
        drinksService.deleteDrink(id);
        return ResponseEntity.noContent().build();
    }

    // MENU ------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMenu() {
        return ResponseEntity.ok().body(menuService.getMenu());
    }
}
