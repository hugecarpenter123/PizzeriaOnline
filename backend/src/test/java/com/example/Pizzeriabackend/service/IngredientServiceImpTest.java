package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.request.CreateIngredientRequest;
import com.example.Pizzeriabackend.repository.IngredientRepository;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class IngredientServiceImpTest {

    @InjectMocks
    private IngredientServiceImp ingredientService;

    @Mock
    private IngredientRepository ingredientRepository;

    @Test
    public void testCreateIngredient() {
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
    public void testGetAllIngredients() {
        List<Ingredient> ingredients = Arrays.asList(
                new Ingredient(1L, "Cheese", 5.0),
                new Ingredient(2L, "Tomato", 2.0)
        );

        when(ingredientRepository.findAll()).thenReturn(ingredients);

        List<Ingredient> result = ingredientService.getAllIngredients();

        assertThat(result).containsExactlyInAnyOrderElementsOf(ingredients);
    }

    @Test
    public void testUpdateIngredient() {
        long ingredientId = 1L;
        CreateIngredientRequest request = new CreateIngredientRequest();
        request.setName("Mushrooms");
        request.setPrice(3.0);


        Ingredient existingIngredient = new Ingredient(ingredientId, "Cheese", 5.0);
        Ingredient updatedIngredient = new Ingredient(ingredientId, "Mushrooms", 3.0);

//        ArgumentCaptor<Ingredient> argumentCaptor = ArgumentCaptor.forClass(Ingredient.class);

        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(existingIngredient));
        when(ingredientRepository.save(any(Ingredient.class))).thenReturn(updatedIngredient);

        Ingredient result = ingredientService.updateIngredient(ingredientId, request);

//        verify(ingredientRepository).save(argumentCaptor.capture());
        verify(ingredientRepository).save(any());
        assertThat(result).isEqualTo(updatedIngredient);

    }

    @Test
    public void testDeleteIngredient() {
        long ingredientId = 1L;
        ingredientService.deleteIngredient(ingredientId);

        Mockito.verify(ingredientRepository).deleteById(ingredientId);
    }
}
