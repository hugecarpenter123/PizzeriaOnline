package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.model.response.PizzaDTO;
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
@RequestMapping("/api/pizza")
public class PizzaController {

    @Autowired
    private PizzaService pizzaService;

    @GetMapping
    public ResponseEntity<Map<String, List<PizzaDTO>>> getAllPizzas() {
        return ResponseEntity.ok().body(Map.of("result", pizzaService.getAllPizzas()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, PizzaDTO>> getPizza(@PathVariable("id") long id) {
        return ResponseTemplate.success(HttpStatus.OK, pizzaService.getPizzaWithReviews(id));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Map<String, PizzaDTO>> createPizza(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("pizzaModel") String pizzaModel) {
        PizzaDTO pizza = pizzaService.createPizza(image, pizzaModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", pizza));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePizza(@PathVariable long id) {
        pizzaService.deletePizza(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping
    public ResponseEntity<Void> deleteAllPizzas() {
        pizzaService.deleteAllPizzas();
        return ResponseEntity.noContent().build();
    }
}
