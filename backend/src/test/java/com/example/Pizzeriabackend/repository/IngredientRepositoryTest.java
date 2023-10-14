package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.utils.PostgreSQLContainerManager;
import com.example.Pizzeriabackend.entity.Ingredient;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.testcontainers.containers.PostgreSQLContainer;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class IngredientRepositoryTest {

//    private static final PostgreSQLContainer<?> postgresContainer = PostgreSQLContainerManager.getContainer();
//    @Autowired
//    private IngredientRepository ingredientRepository;
//
//    @Test
//    public void shouldSaveIngredient() {
//        Ingredient ingredient = Ingredient.builder()
//                .name("Chilli")
//                .price(2.5)
//                .build();
//
//        Ingredient savedIngredient = ingredientRepository.save(ingredient);
//        Assertions.assertThat(savedIngredient).usingRecursiveComparison().ignoringFields("id").isEqualTo(ingredient);
//    }
//
//    @Test
//    public void shouldUpdateIngredient() {
//        Ingredient ingredient = Ingredient.builder()
//                .name("Chilli")
//                .price(2.5)
//                .build();
//
//        Ingredient savedIngredient = ingredientRepository.save(ingredient);
//
//        savedIngredient.setPrice(2.49);
//        savedIngredient.setName("Chili");
//
//        Ingredient updatedIngredient = ingredientRepository.save(savedIngredient);
//        Ingredient retrievedIngredient = ingredientRepository.findById(updatedIngredient.getId()).orElse(null);
//        Assertions.assertThat(retrievedIngredient)
//                .isNotNull()
//                .usingRecursiveComparison()
//                .isEqualTo(updatedIngredient);
//    }

}