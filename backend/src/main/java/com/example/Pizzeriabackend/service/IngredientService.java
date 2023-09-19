package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.IngredientModel;

import java.util.List;

public interface IngredientService {
    Ingredient createIngredient(IngredientModel ingredientModel);
    List<Ingredient> getAllIngredients();
    Ingredient updateIngredient(long id, IngredientModel ingredientModel);
    void deleteIngredient(long id);
}
