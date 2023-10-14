package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.request.CreateIngredientRequest;
import com.example.Pizzeriabackend.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientServiceImp implements IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository;
    @Override
    public Ingredient createIngredient(CreateIngredientRequest ingredientModel) {
        Ingredient ingredient = Ingredient.builder()
                .name(ingredientModel.getName())
                .price(ingredientModel.getPrice())
                .build();

        return ingredientRepository.save(ingredient);
    }

    @Override
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @Override
    public Ingredient updateIngredient(long id, CreateIngredientRequest ingredientModel) {
        Ingredient ingredient = ingredientRepository.findById(id).orElseThrow();
        if (ingredientModel.getName() != null &&!ingredientModel.getName().isEmpty()) {
            ingredient.setName(ingredientModel.getName());
        }
        if (ingredientModel.getPrice() > 0.0) ingredient.setPrice(ingredientModel.getPrice());

        return ingredientRepository.save(ingredient);
    }

    @Override
    public void deleteIngredient(long id) {
        ingredientRepository.deleteById(id);
    }

    @Override
    public void deleteAllIngredients() {
        ingredientRepository.deleteAll();
    }
}
