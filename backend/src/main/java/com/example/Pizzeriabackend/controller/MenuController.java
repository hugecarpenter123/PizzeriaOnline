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
    public ResponseEntity<Map<String, List<PizzaDTO>>> getAllPizzas() {
        return ResponseEntity.ok().body(Map.of("result", pizzaService.getAllPizzas()));
    }

    @GetMapping("/pizza/{id}")
    public ResponseEntity<Map<String, PizzaDTO>> getPizza(@PathVariable("id") long id) {
        return ResponseTemplate.success(HttpStatus.OK, pizzaService.getPizzaWithReviews(id));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/pizza")
    public ResponseEntity<Map<String, PizzaDTO>> createPizza(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("pizzaModel") String pizzaModel) {
        PizzaDTO pizza = pizzaService.createPizza(image, pizzaModel);
        return ResponseEntity.ok().body(Map.of("result", pizza));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/pizza/{id}")
    public ResponseEntity<Void> deletePizza(@PathVariable long id) {
        pizzaService.deletePizza(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/pizza")
    public ResponseEntity<Void> deleteAllPizzas() {
        pizzaService.deleteAllPizzas();
        return ResponseEntity.noContent().build();
    }

    // ingredient ------------------------------------------------------------------
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/ingredient")
    public ResponseEntity<Map<String, Ingredient>> createIngredient(@RequestBody CreateIngredientRequest ingredientModel) {
        return ResponseEntity.ok().body(Map.of("result", ingredientService.createIngredient(ingredientModel)));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/ingredient/{id}")
    public ResponseEntity<Void> createIngredient(@PathVariable long id) {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/ingredient")
    public ResponseEntity<Void> deleteAllIngredients() {
        ingredientService.deleteAllIngredients();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/ingredient/{id}")
    public ResponseEntity<Map<String, Ingredient>> updateIngredient(@PathVariable long id, CreateIngredientRequest ingredientModel) {
        Ingredient ingredient = ingredientService.updateIngredient(id, ingredientModel);
        return ResponseEntity.ok(Map.of("result", ingredient));
    }

    @GetMapping("/ingredient")
    public ResponseEntity<Map<String, List<Ingredient>>> getAllIngredients() {
        return ResponseEntity.ok().body(Map.of("result", ingredientService.getAllIngredients()));
    }

    // DRINKS ------------------------------------------------------------------
    @GetMapping("/drink")
    public ResponseEntity<Map<String, List<DrinkDTO>>> getAllDrinks() {
        return ResponseEntity.ok().body(Map.of("result", drinksService.getAllDrinks()));
    }

    @GetMapping("/drink/{id}")
    public ResponseEntity<Map<String, Drink>> getDrink(@PathVariable long id) {
        return ResponseEntity.ok().body(Map.of("result", drinksService.getDrink(id)));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/drink")
    public ResponseEntity<Map<String, DrinkDTO>> createDrink(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("drinkModel") String jsonDrinkModel) {
        DrinkDTO drink = drinksService.createDrink(image, jsonDrinkModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", drink));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/drink/{id}")
    public ResponseEntity<Void> deleteDrink(@PathVariable long id) {
        drinksService.deleteDrink(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/drink")
    public ResponseEntity<Void> deleteAllDrinks() {
        drinksService.deleteAllDrinks();
        return ResponseEntity.noContent().build();
    }

    // MENU ------------------------------------------------------------------
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMenu() {
        return ResponseEntity.ok().body(menuService.getMenu());
    }
}
