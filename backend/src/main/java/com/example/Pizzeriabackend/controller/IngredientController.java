package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.request.CreateIngredientRequest;
import com.example.Pizzeriabackend.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/ingredient")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;

    @GetMapping
    public ResponseEntity<Map<String, List<Ingredient>>> getAllIngredients() {
        return ResponseEntity.ok().body(Map.of("result", ingredientService.getAllIngredients()));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, Ingredient>> createIngredient(@RequestBody CreateIngredientRequest ingredientModel) {
        return ResponseEntity.ok().body(Map.of("result", ingredientService.createIngredient(ingredientModel)));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> createIngredient(@PathVariable long id) {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping
    public ResponseEntity<Void> deleteAllIngredients() {
        ingredientService.deleteAllIngredients();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Ingredient>> updateIngredient(@PathVariable long id, CreateIngredientRequest ingredientModel) {
        Ingredient ingredient = ingredientService.updateIngredient(id, ingredientModel);
        return ResponseEntity.ok(Map.of("result", ingredient));
    }

}
