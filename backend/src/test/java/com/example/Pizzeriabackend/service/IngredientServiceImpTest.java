package com.example.Pizzeriabackend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.request.CreateIngredientRequest;
import com.example.Pizzeriabackend.repository.IngredientRepository;

@ExtendWith(MockitoExtension.class)
public class IngredientServiceImpTest {

    @InjectMocks
    private IngredientServiceImp ingredientService;

    @Mock
    private IngredientRepository ingredientRepository;

    @Test
    public void should_CreateIngredient_WhenValidRequestProvided() {
        CreateIngredientRequest request = new CreateIngredientRequest();
        request.setName("Cheese");
        request.setPrice(5.0);

        Ingredient createdIngredient = Ingredient.builder()
                .id(1L)
                .name("Cheese")
                .price(5.0)
                .build();

        when(ingredientRepository.save(any(Ingredient.class))).thenReturn(createdIngredient);

        Ingredient result = ingredientService.createIngredient(request);

        assertThat(result).isEqualTo(createdIngredient);
    }

    @Test
    public void should_ReturnAllIngredients_WhenGettingIngredients() {
        List<Ingredient> ingredients = Arrays.asList(
                new Ingredient(1L, "Cheese", 5.0),
                new Ingredient(2L, "Tomato", 2.0)
        );

        when(ingredientRepository.findAll()).thenReturn(ingredients);

        List<Ingredient> result = ingredientService.getAllIngredients();

        assertThat(result).containsExactlyInAnyOrderElementsOf(ingredients);
    }

    @Test
    public void should_UpdateIngredient_WhenValidIdAndRequestProvided() {
        long ingredientId = 1L;
        CreateIngredientRequest request = new CreateIngredientRequest();
        request.setName("Mushrooms");
        request.setPrice(3.0);


        Ingredient existingIngredient = new Ingredient(ingredientId, "Cheese", 5.0);
        Ingredient updatedIngredient = new Ingredient(ingredientId, "Mushrooms", 3.0);

        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(existingIngredient));
        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(existingIngredient));
        when(ingredientRepository.save(any(Ingredient.class))).thenReturn(updatedIngredient);

        Ingredient result = ingredientService.updateIngredient(ingredientId, request);

        verify(ingredientRepository).save(any());
        assertThat(result).isEqualTo(updatedIngredient);

    }

    @Test
    public void should_DeleteIngredient_WhenValidIdProvided() {
        long ingredientId = 1L;
        ingredientService.deleteIngredient(ingredientId);

        Mockito.verify(ingredientRepository).deleteById(ingredientId);
    }
}
