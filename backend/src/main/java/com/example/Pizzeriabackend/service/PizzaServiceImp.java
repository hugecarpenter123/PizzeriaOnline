package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.model.response.PizzaDTO;
import com.example.Pizzeriabackend.model.request.CreatePizzaRequest;
import com.example.Pizzeriabackend.repository.IngredientRepository;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.ReviewRepository;
import com.example.Pizzeriabackend.util.ServiceUtils;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PizzaServiceImp implements PizzaService {
    @Autowired
    private PizzaRepository pizzaRepository;
    @Autowired
    private IngredientRepository ingredientRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private StaticAppInfo staticAppInfo;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private ImageService imageService;
    @Autowired
    private ServiceUtils serviceUtils;

    @Override
    public Pizza getPizza(Long id) {
//        return pizzaRepository.findById(id).orElseThrow();
        Optional<Pizza> pizza = pizzaRepository.findById(id);
        return pizza.orElse(null);
    }

    @Override
    public PizzaDTO createPizza(MultipartFile image, String jsonPizzaModel) {
        if (serviceUtils.hasAdminPerms()) {
            // TODO: 24.08.2023 uncomment those lines after finishing debug
//            throw new NoUserPermissionException("Requester is not authorised to perform this task");
        }

        try {
            CreatePizzaRequest createPizzaRequest = objectMapper.readValue(jsonPizzaModel, CreatePizzaRequest.class);

            boolean isPizzaModelOk =
                    (createPizzaRequest.getName() != null && !createPizzaRequest.getName().isEmpty())
                    && (createPizzaRequest.getSmallSizePrice() > 0)
                    && (createPizzaRequest.getMediumSizePrice() > 0)
                    && (createPizzaRequest.getBigSizePrice() > 0)
                    && (createPizzaRequest.getIngredientIds() != null && !createPizzaRequest.getIngredientIds().isEmpty());

            if (!isPizzaModelOk) throw new GeneralBadRequestException("New pizza parameters filled improperly");

            String imageUrl = image != null
                    ? imageService.saveImage(image, StaticAppInfo.IMAGE_FOLDER.PIZZA, createPizzaRequest.getName())
                    : staticAppInfo.getDefaultPizzaImgUrl();

            List<Ingredient> ingredients = ingredientRepository.findAllById(createPizzaRequest.getIngredientIds());
            Pizza pizza = Pizza.builder()
                    .name(createPizzaRequest.getName())
                    .smallSizePrice(createPizzaRequest.getSmallSizePrice())
                    .mediumSizePrice(createPizzaRequest.getMediumSizePrice())
                    .bigSizePrice(createPizzaRequest.getBigSizePrice())
                    .ingredients(ingredients)
                    .imageUrl(imageUrl)
                    .reviews(Collections.emptyList())
                    .build();

            return new PizzaDTO(pizzaRepository.save(pizza));

        } catch (Exception e) {
            e.printStackTrace();
            throw new GeneralBadRequestException("Improperly formatted JSON data");
        }
    }

    @Override
    public void deletePizza(Long id) {
        pizzaRepository.deleteById(id);
    }

    @Override
    public PizzaDTO getPizzaWithReviews(Long id) {
        Pizza pizza = pizzaRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Pizza not found"));
        return new PizzaDTO(pizza);
    }

    @Override
    public List<PizzaDTO> getAllPizzas() {
        return pizzaRepository.findAll().stream().map(PizzaDTO::new).toList();
    }

    @Override
    public void deleteAllPizzas() {
        pizzaRepository.deleteAll();
    }

}
