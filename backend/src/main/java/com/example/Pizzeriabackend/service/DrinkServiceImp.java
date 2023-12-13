package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Drink;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralServerException;
import com.example.Pizzeriabackend.model.response.DrinkDTO;
import com.example.Pizzeriabackend.model.request.CreateDrinkRequest;
import com.example.Pizzeriabackend.repository.DrinkRepository;
import com.example.Pizzeriabackend.util.ServiceUtils;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;

@Service
public class DrinkServiceImp implements DrinksService {
    @Autowired
    private DrinkRepository drinkRepository;
    @Autowired
    private StaticAppInfo staticAppInfo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ImageService imageService;
    @Autowired
    private ServiceUtils serviceUtils;

    @Override
    public DrinkDTO createDrink(MultipartFile image, String jsonDrinkModel) {
        try {
            CreateDrinkRequest createDrinkRequest = objectMapper.readValue(jsonDrinkModel, CreateDrinkRequest.class);
            boolean isDrinkModelOk = createDrinkRequest.getName() != null
                    && !createDrinkRequest.getName().isEmpty()
                    && createDrinkRequest.getSmallSizePrice() > 0
                    && createDrinkRequest.getMediumSizePrice() > 0
                    && createDrinkRequest.getBigSizePrice() > 0;

            if (!isDrinkModelOk) throw new GeneralBadRequestException("Drink creation details are not properly filled");

            String imageUrl = image != null
                    ? imageService.saveImage(image, StaticAppInfo.IMAGE_FOLDER.DRINK , createDrinkRequest.getName())
                    : staticAppInfo.getDefaultDrinkImgUrl();

            Drink drink = Drink.builder()
                    .name(createDrinkRequest.getName())
                    .smallSizePrice(createDrinkRequest.getSmallSizePrice())
                    .mediumSizePrice(createDrinkRequest.getMediumSizePrice())
                    .bigSizePrice(createDrinkRequest.getBigSizePrice())
                    .imageUrl(imageUrl)
                    .build();

            return new DrinkDTO(drinkRepository.save(drink));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new GeneralServerException("Error during parsing jsonDrinkModel");
        }
    }


    @Override
    public Drink getDrink(long id) {
        Optional<Drink> drink = drinkRepository.findById(id);
        return drink.orElse(null);
    }

    @Override
    public void deleteDrink(long id) {
        drinkRepository.deleteById(id);
    }

    @Override
    public List<DrinkDTO> getAllDrinks() {
        return drinkRepository.findAll().stream().map(DrinkDTO::new).toList();
    }

    @Override
    public void deleteAllDrinks() {
        drinkRepository.deleteAll();;
    }
}
