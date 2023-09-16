package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.PizzeriaBackendApplication;
import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.exception.GeneralServerException;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.model.DTO.PizzaDTO;
import com.example.Pizzeriabackend.model.PizzaModel;
import com.example.Pizzeriabackend.repository.IngredientRepository;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.ReviewRepository;
import com.example.Pizzeriabackend.util.ServiceUtils;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.tools.jconsole.JConsoleContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @Override
    public List<Pizza> getAllPizzas() {
        return pizzaRepository.findAll();
    }

    @Override
    public Pizza getPizza(Long id) {
//        return pizzaRepository.findById(id).orElseThrow();
        Optional<Pizza> pizza = pizzaRepository.findById(id);
        return pizza.orElse(null);
    }

    @Override
    public PizzaDTO createPizza(MultipartFile image, String jsonPizzaModel) {
        if (!ServiceUtils.hasAdminPerms()) {
            // TODO: 24.08.2023 uncomment those lines after finishing debug
//            throw new NoUserPermissionException("Requester is not authorised to perform this task");
        }

        try {
            PizzaModel pizzaModel = objectMapper.readValue(jsonPizzaModel, PizzaModel.class);

            boolean isPizzaModelOk =
                    (pizzaModel.getName() != null && !pizzaModel.getName().isEmpty())
                    && (pizzaModel.getSmallSizePrice() > 0)
                    && (pizzaModel.getMediumSizePrice() > 0)
                    && (pizzaModel.getBigSizePrice() > 0)
                    && (pizzaModel.getIngredientIds() != null && !pizzaModel.getIngredientIds().isEmpty());

            if (!isPizzaModelOk) throw new GeneralBadRequestException("New pizza parameters filled improperly");

            String imageUrl = image != null
                    ? imageService.saveImage(image, ServiceUtils.IMAGE_FOLDER.PIZZA, pizzaModel.getName())
                    : staticAppInfo.getDefaultPizzaImgUrl();

            List<Ingredient> ingredients = ingredientRepository.findAllById(pizzaModel.getIngredientIds());
            Pizza pizza = Pizza.builder()
                    .name(pizzaModel.getName())
                    .smallSizePrice(pizzaModel.getSmallSizePrice())
                    .mediumSizePrice(pizzaModel.getMediumSizePrice())
                    .bigSizePrice(pizzaModel.getBigSizePrice())
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
    public List<PizzaDTO> getAllPizzas2() {
        return pizzaRepository.findAll().stream().map(PizzaDTO::new).toList();
    }

    // this implementation returns all pizzas but with corresponding reviews
    @Override
    public List<PizzaDTO> getAllPizzas3() {
        return pizzaRepository.findAll().stream().map(PizzaDTO::new).toList();
    }

//    private String saveImage(MultipartFile image, String imageName) {
//        // Check if the image is empty
//        if (image.isEmpty()) {
//            throw new GeneralBadRequestException("Image can not be empty");
//        }
//
//        // check content type
//        String contentType = image.getContentType();
//        if (contentType == null || !contentType.startsWith("image/")) {
//            throw new GeneralBadRequestException("Invalid format of the file");
//        }
//
//        // check if extension is present
//        String originalFilename = image.getOriginalFilename();
//        String fileNameExtension;
//        if (originalFilename == null) {
//            throw new GeneralBadRequestException("Image doesn't have file extension");
//        } else {
//            fileNameExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
//            if (fileNameExtension.isEmpty()) {
//                throw new GeneralBadRequestException("Image doesn't have file extension");
//            }
//        }
//
//        // declare upload dir and file name
////        String sanitizedFileName = imageName.replaceAll("[^a-zA-Z]", "_").toLowerCase();
////        String imageFileName = sanitizedFileName + fileNameExtension;
//        String imageFileName = imageName + fileNameExtension;
//
//        // Save the image to the static directory
//        try {
//            Resource resource = resourceLoader.getResource(staticAppInfo.getUploadPizzaImgDir());
//            String imagePath = resource.getFile().getAbsolutePath() + "/" + imageFileName;
//
//            byte[] bytes = image.getBytes();
//            Path filePath = Paths.get(imagePath);
//            Files.write(filePath, bytes);
//
//            return staticAppInfo.getPizzaImgUrlPath() + "/" + imageFileName;
//
//        } catch (IOException e) {
//            e.printStackTrace();
//            throw new GeneralServerException("Failed to save the image");
//        }
//    }

}
