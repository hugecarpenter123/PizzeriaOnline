package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.request.CreateIngredientRequest;

import java.util.List;

public interface IngredientService {
    Ingredient createIngredient(CreateIngredientRequest ingredientModel);
    List<Ingredient> getAllIngredients();
    Ingredient updateIngredient(long id, CreateIngredientRequest ingredientModel);
    void deleteIngredient(long id);
    void deleteAllIngredients();
}
