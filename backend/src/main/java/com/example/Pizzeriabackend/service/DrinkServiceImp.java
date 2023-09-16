package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Drink;
import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralServerException;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.model.DTO.DrinkDTO;
import com.example.Pizzeriabackend.model.DrinkModel;
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

    @Override
    public DrinkDTO createDrink(MultipartFile image, String jsonDrinkModel) {
        System.out.println("DrinkService -> createDrink()");
        if (!ServiceUtils.hasAdminPerms()) {
            // TODO: 24.08.2023 actually - SecurityConfig may prevent from accessing this endpoint
            // throw new NoUserPermissionException("Requester is not authorized to perform this operation");
        }
        try {
            DrinkModel drinkModel = objectMapper.readValue(jsonDrinkModel, DrinkModel.class);
            boolean isDrinkModelOk = drinkModel.getName() != null
                    && !drinkModel.getName().isEmpty()
                    && drinkModel.getSmallSizePrice() > 0
                    && drinkModel.getMediumSizePrice() > 0
                    && drinkModel.getBigSizePrice() > 0;

            if (!isDrinkModelOk) throw new GeneralBadRequestException("Drink creation details are not properly filled");

            String imageUrl = image != null
                    ? imageService.saveImage(image, ServiceUtils.IMAGE_FOLDER.DRINK ,drinkModel.getName())
                    : staticAppInfo.getDefaultDrinkImgUrl();

            Drink drink = Drink.builder()
                    .name(drinkModel.getName())
                    .smallSizePrice(drinkModel.getSmallSizePrice())
                    .mediumSizePrice(drinkModel.getMediumSizePrice())
                    .bigSizePrice(drinkModel.getBigSizePrice())
                    .imageUrl(imageUrl)
                    .build();

            return new DrinkDTO(drinkRepository.save(drink));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new GeneralServerException("Error during parsing jsonDrinkModel");
        }
    }

    @Override
    public List<Drink> getAllDrinks() {
        return drinkRepository.findAll();
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
    public List<DrinkDTO> getAllDrinks2() {
        return drinkRepository.findAll().stream().map(DrinkDTO::new).toList();
    }
}
