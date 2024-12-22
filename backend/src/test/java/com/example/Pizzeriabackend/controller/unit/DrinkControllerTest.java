package com.example.Pizzeriabackend.controller.unit;

import java.nio.charset.StandardCharsets;
import java.util.List;

import com.example.Pizzeriabackend.controller.DrinkController;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.entity.Drink;
import com.example.Pizzeriabackend.model.response.DrinkDTO;
import com.example.Pizzeriabackend.service.DrinksService;


//@SpringBootTest
@WebMvcTest(controllers = DrinkController.class)
@AutoConfigureMockMvc(addFilters = false)
class DrinkControllerTest {

    @MockBean
    private DrinksService drinksService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private MockMvc mockMvc;

    private List<Drink> drinkList;
    private List<DrinkDTO> drinkDTOList;

    @BeforeEach
    public void setUp() {
        drinkList = List.of(
                Drink.builder()
                        .id(1L)
                        .imageUrl("")
                        .name("Cola")
                        .smallSizePrice(1)
                        .mediumSizePrice(2)
                        .bigSizePrice(3)
                        .build(),
                Drink.builder()
                        .id(2L)
                        .imageUrl("")
                        .name("Pepsi")
                        .smallSizePrice(1)
                        .mediumSizePrice(2)
                        .bigSizePrice(3)
                        .build()
        );

        drinkDTOList = drinkList.stream().map(DrinkDTO::new).toList();
    }

    @Test
    @WithMockUser(roles = "USER")
    void should_ReturnAllDrinks_WhenGettingDrinks() throws Exception {
        Mockito.when(drinksService.getAllDrinks()).thenReturn(drinkDTOList);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/drink"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result", Matchers.hasSize(2)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].name").value("Cola"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[1].id").value(2L));
    }

    @Test
    @WithMockUser(roles = "USER")
    void should_ReturnDrink_WhenGettingDrinkById() throws Exception {
        Mockito.when(drinksService.getDrink(2)).thenReturn(drinkList.get(1));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/drink/{id}", 2L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.name").value("Pepsi"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void should_CreateDrink_WhenValidDataProvided() throws Exception {
        Drink drink = Drink.builder()
                .id(3L)
                .name("Test Drink")
                .smallSizePrice(2.5)
                .mediumSizePrice(3.5)
                .bigSizePrice(4.5)
                .build();

        DrinkDTO response = new DrinkDTO(drink);

        String jsonDrinkModel = String.format("{ \"name\": \"%s\", \"smallSizePrice\": %f, \"mediumSizePrice\": %f, \"bigSizePrice\": %f }",
                drink.getName(), drink.getSmallSizePrice(), drink.getMediumSizePrice(), drink.getBigSizePrice());

        MockMultipartFile image = new MockMultipartFile(
                "image",
                "test.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "image data".getBytes(StandardCharsets.UTF_8)
        );

        Mockito.when(drinksService.createDrink(image, jsonDrinkModel)).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.multipart(HttpMethod.POST, "/api/drink")
                        .file(image)
                        .param("drinkModel", jsonDrinkModel))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.id").value(3L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.name").value("Test Drink"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.smallSizePrice").value(2.5))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.mediumSizePrice").value(3.5))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result.bigSizePrice").value(4.5));
    }

    @Test
    @WithMockUser(username = "username", roles = "ADMIN")
    void should_DeleteDrink_WhenValidIdProvided() throws Exception {
        Mockito.doNothing().when(drinksService).deleteDrink(Mockito.anyLong());
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/drink/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        Mockito.verify(drinksService, Mockito.times(1)).deleteDrink(Mockito.anyLong());
    }

    @Test
    @WithMockUser(username = "username", roles = "ADMIN")
    void should_DeleteAllDrinks_WhenDeletingDrinks() throws Exception {
        Mockito.doNothing().when(drinksService).deleteAllDrinks();

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/drink"))
                .andExpect(MockMvcResultMatchers.status().isNoContent());

        Mockito.verify(drinksService, Mockito.times(1)).deleteAllDrinks();
    }
}