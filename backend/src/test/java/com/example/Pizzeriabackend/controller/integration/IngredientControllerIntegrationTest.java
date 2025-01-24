package com.example.Pizzeriabackend.controller.integration;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.repository.IngredientRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class IngredientControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IngredientRepository ingredientRepository;

    private static String adminToken;
    private static String userToken;

    @BeforeAll
    static void setUp(@Autowired JwtService jwtService, @Autowired UserRepository userRepository) {
        User admin = User.builder()
                .email("mockedAdmin@example.com")
                .name("Matthew")
                .surname("McConaughey")
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        adminToken = jwtService.generateToken(admin);

        User user = User.builder()
                .email("mockedUser@example.com")
                .name("Matthew")
                .surname("Baba")
                .role(Role.ADMIN)
                .build();
        userRepository.save(user);
        userToken = jwtService.generateToken(user);
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    public void shouldNotCreateIngredientWhenUserRoleIsUser() throws Exception {
        // given
        String jsonRequest = "{\"name\":\"Cheese\",\"price\":5.0}";

        // when & then
        mockMvc.perform(post("/api/ingredient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    public void shouldNotDeleteIngredient() throws Exception {
        // given
        Ingredient ingredient = new Ingredient();
        ingredient.setName("Cheese");
        ingredient.setPrice(5.0);
        ingredientRepository.save(ingredient);

        // when & then
        mockMvc.perform(delete("/api/ingredient/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldCreateIngredientWhenUserRoleIsAdmin() throws Exception {
        // given
        String jsonRequest = "{\"name\":\"Cheese\",\"price\":5.0}";

        // when & then
        mockMvc.perform(post("/api/ingredient")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.name").value("Cheese"));

        Ingredient savedIngredient = ingredientRepository.findAll().get(0);
        assert savedIngredient.getName().equals("Cheese");
    }

    @Test
    public void shouldReturnAllIngredients() throws Exception {
        // given
        Ingredient ingredient = new Ingredient();
        ingredient.setName("Cheese");
        ingredient.setPrice(5.0);
        ingredientRepository.save(ingredient);

        // when & then
        mockMvc.perform(get("/api/ingredient"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result", hasSize(1)))
                .andExpect(jsonPath("$.result[0].name").value("Cheese"));
    }
}