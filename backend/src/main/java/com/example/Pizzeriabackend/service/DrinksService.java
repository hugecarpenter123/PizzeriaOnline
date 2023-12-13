package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Drink;
import com.example.Pizzeriabackend.model.response.DrinkDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DrinksService {
    DrinkDTO createDrink(MultipartFile image, String jsonDrinkModel);

    Drink getDrink(long id);

    void deleteDrink(long id);

    List<DrinkDTO> getAllDrinks();

    void deleteAllDrinks();
}
