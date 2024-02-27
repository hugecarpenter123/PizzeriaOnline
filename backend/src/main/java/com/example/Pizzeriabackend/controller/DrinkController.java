package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.entity.Drink;
import com.example.Pizzeriabackend.model.response.DrinkDTO;
import com.example.Pizzeriabackend.service.DrinksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drink")
public class DrinkController {

    @Autowired
    private DrinksService drinksService;

    @GetMapping
    public ResponseEntity<Map<String, List<DrinkDTO>>> getAllDrinks() {
        return ResponseEntity.ok().body(Map.of("result", drinksService.getAllDrinks()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Drink>> getDrink(@PathVariable long id) {
        return ResponseEntity.ok().body(Map.of("result", drinksService.getDrink(id)));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, DrinkDTO>> createDrink(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("drinkModel") String jsonDrinkModel) {
        DrinkDTO drink = drinksService.createDrink(image, jsonDrinkModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", drink));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDrink(@PathVariable long id) {
        drinksService.deleteDrink(id);
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping
    public ResponseEntity<Void> deleteAllDrinks() {
        drinksService.deleteAllDrinks();
        return ResponseEntity.noContent().build();
    }
}
