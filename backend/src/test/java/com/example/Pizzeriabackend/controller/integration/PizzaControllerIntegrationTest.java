package com.example.Pizzeriabackend.controller.integration;

import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.model.request.CreatePizzaRequest;
import com.example.Pizzeriabackend.model.response.PizzaDTO;
import com.example.Pizzeriabackend.model.util.StaticAppInfo;
import com.example.Pizzeriabackend.repository.IngredientRepository;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Fail.fail;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)

public class PizzaControllerIntegrationTest {

    @Autowired
    private PizzaRepository pizzaRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private StaticAppInfo staticAppInfo;

    @Autowired
    private JwtService jwtService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private Environment environment;

    @AfterEach
    void cleanUp() {
        pizzaRepository.deleteAll();
    }

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
                .role(Role.USER)
                .build();
        userRepository.save(user);
        userToken = jwtService.generateToken(user);
    }

    @Test
    void shouldReturnAllPizzas() {
        // Arrange
        Pizza pizza1 = new Pizza(null, "Margherita", 10.0, 12.0, 15.0, Collections.emptyList(), Collections.emptyList(), null);
        Pizza pizza2 = new Pizza(null, "Pepperoni", 11.0, 13.0, 16.0, Collections.emptyList(), Collections.emptyList(), null);
        pizzaRepository.save(pizza1);
        pizzaRepository.save(pizza2);

        String url = "http://" + this.staticAppInfo.getApplicationHost() + "/api/pizza";

        // Act
        var response = restTemplate.getForEntity(url, Map.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<Map<String, Object>> result = (List<Map<String, Object>>) response.getBody().get("result");
        assertThat(result).hasSize(2);
        assertThat(result.get(0).get("name")).isEqualTo("Margherita");
        assertThat(result.get(1).get("name")).isEqualTo("Pepperoni");
    }

    @Test
    void shouldCreatePizza() throws JsonProcessingException {
        // Arrange
        CreatePizzaRequest request = new CreatePizzaRequest();
        request.setName("Hawaiian");
        request.setSmallSizePrice(10.0);
        request.setMediumSizePrice(12.0);
        request.setBigSizePrice(14.0);
        request.setIngredientIds(List.of(1L));

        ObjectMapper objectMapper = new ObjectMapper();
        String pizzaModelJson = objectMapper.writeValueAsString(request);

        String url = "http://" + this.staticAppInfo.getApplicationHost() + "/api/pizza";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("pizzaModel", pizzaModelJson);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("Authorization", "Bearer " + adminToken);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        // Act
        var response = restTemplate.exchange(url, HttpMethod.POST, entity, new ParameterizedTypeReference<Map<String, PizzaDTO>>() {
        });

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("result").getName()).isEqualTo("Hawaiian");

        var pizzaFromDb = pizzaRepository.findAll();
        assertThat(pizzaFromDb).hasSize(1);
        assertThat(pizzaFromDb.get(0).getName()).isEqualTo("Hawaiian");
    }

    @Test
    void shouldNotCreatePizzaWithoutAuthToken() throws JsonProcessingException {
        // Arrange
        CreatePizzaRequest request = new CreatePizzaRequest();
        request.setName("Hawaiian");
        request.setSmallSizePrice(10.0);
        request.setMediumSizePrice(12.0);
        request.setBigSizePrice(14.0);
        request.setIngredientIds(List.of(1L));

        ObjectMapper objectMapper = new ObjectMapper();
        String pizzaModelJson = objectMapper.writeValueAsString(request);

        String url = "http://" + this.staticAppInfo.getApplicationHost() + "/api/pizza";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("pizzaModel", pizzaModelJson);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        try {
            // Act
            restTemplate.exchange(url, HttpMethod.POST, entity, new ParameterizedTypeReference<Map<String, PizzaDTO>>() {});
            fail("Expected HttpClientErrorException$Unauthorized but it was not thrown.");
        } catch (HttpClientErrorException.Forbidden e) {
            // Assert
            assertThat(e.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getResponseBodyAsString()).contains("Requester doesn't have permission to access this endpoint");
        }

        var pizzaFromDb = pizzaRepository.findAll();
        assertThat(pizzaFromDb).isEmpty();
    }

    @Test
    @WithMockUser(username = "Matthew", roles = {"ADMIN"})
    void shouldDeletePizza() {
        // Arrange
        Pizza pizza = new Pizza(null, "DeleteMe", 9.0, 11.0, 13.0, null, null, null);
        Pizza savedPizza = pizzaRepository.save(pizza);

        String url = "http://" + this.staticAppInfo.getApplicationHost() + "/api/pizza/" + savedPizza.getId();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + adminToken);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        // Act
        restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);

        // Assert
        assertThat(pizzaRepository.findById(savedPizza.getId())).isEmpty();
    }

    @Test
    void shouldntDeleteWhenNoPerms() {
        // Arrange
        Pizza pizza = new Pizza(null, "DeleteMe", 9.0, 11.0, 13.0, null, null, null);
        Pizza savedPizza = pizzaRepository.save(pizza);

        String url = "http://" + this.staticAppInfo.getApplicationHost() + "/api/pizza/" + savedPizza.getId();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + userToken);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        try {
            // act
            restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
            fail("Expected HttpClientErrorException$Forbidden but it was not thrown.");
        } catch (HttpClientErrorException.Forbidden e) {
            // assert
            assertThat(e.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
            assertThat(e.getResponseBodyAsString()).contains("Requester doesn't have permission to access this endpoint");
        }
    }

    @Test
    void shouldGetPizzaById() throws Exception {
        // Arrange
        var ingredient = ingredientRepository.save(Ingredient.builder()
                .name("Onion")
                .price(1.5)
                .build());

        var pizza = Pizza.builder()
                .name("Hawaiian")
                .smallSizePrice(9.0)
                .mediumSizePrice(11.0)
                .bigSizePrice(13.0)
                .ingredients(List.of(ingredient))
                .build();

        pizza = pizzaRepository.save(pizza);

        long validPizzaId = pizza.getId();

        String url = "http://" + this.staticAppInfo.getApplicationHost() + "/api/pizza/" + validPizzaId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + userToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Act
        ResponseEntity<Map<String, PizzaDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<Map<String, PizzaDTO>>() {
                }
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("result")).isNotNull();
        assertThat(response.getBody().get("result").getId()).isEqualTo(validPizzaId);
        assertThat(response.getBody().get("result").getName()).isEqualTo("Hawaiian");
    }
}
