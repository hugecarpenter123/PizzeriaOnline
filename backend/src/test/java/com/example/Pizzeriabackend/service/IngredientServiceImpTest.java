package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.model.request.CreateIngredientRequest;
import com.example.Pizzeriabackend.repository.IngredientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class IngredientServiceImpTest {

    @InjectMocks
    private IngredientServiceImp ingredientService;

    @Mock
    private IngredientRepository ingredientRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateIngredient() {
        // Arrange
        CreateIngredientRequest ingredientModel = new CreateIngredientRequest();
        ingredientModel.setName("Cheese");
        ingredientModel.setPrice(5.0);

        Ingredient createdIngredient = Ingredient.builder()
                .id(1L) // Mocked ID
                .name("Cheese")
                .price(5.0)
                .build();

        when(ingredientRepository.save(any(Ingredient.class))).thenReturn(createdIngredient);

        // Act
        Ingredient result = ingredientService.createIngredient(ingredientModel);

        // Assert
        assertThat(result).isEqualTo(createdIngredient);
    }

    @Test
    public void testGetAllIngredients() {
        // Arrange
        List<Ingredient> ingredients = Arrays.asList(
                new Ingredient(1L, "Cheese", 5.0),
                new Ingredient(2L, "Tomato", 2.0)
                // Add more ingredients as needed
        );

        when(ingredientRepository.findAll()).thenReturn(ingredients);

        // Act
        List<Ingredient> result = ingredientService.getAllIngredients();

        // Assert
        assertThat(result).containsExactlyInAnyOrderElementsOf(ingredients);
    }

    @Test
    public void testUpdateIngredient() {
        // Arrange
        long ingredientId = 1L;
        CreateIngredientRequest ingredientModel = new CreateIngredientRequest();
        ingredientModel.setName("Mushrooms");
        ingredientModel.setPrice(3.0);


        Ingredient existingIngredient = new Ingredient(ingredientId, "Cheese", 5.0);
        Ingredient updatedIngredient = Ingredient.builder()
                .id(ingredientId)
                .name("Mushrooms")
                .price(3.0)
                .build();

        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(existingIngredient));
        when(ingredientRepository.save(any(Ingredient.class))).thenReturn(updatedIngredient);

        // Act
        Ingredient result = ingredientService.updateIngredient(ingredientId, ingredientModel);

        // Assert
        assertThat(result).isEqualTo(updatedIngredient);
    }

    @Test
    public void testDeleteIngredient() {
        // Arrange
        long ingredientId = 1L;

        // No need to mock repository behavior for delete

        // Act
        ingredientService.deleteIngredient(ingredientId);

        // Assert
        // You can use Mockito.verify to ensure that the delete method was called with the correct ID
        Mockito.verify(ingredientRepository).deleteById(ingredientId);
    }
}
