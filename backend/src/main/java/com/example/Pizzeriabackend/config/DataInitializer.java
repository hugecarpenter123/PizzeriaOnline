package com.example.Pizzeriabackend.config;

import com.example.Pizzeriabackend.entity.*;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.repository.*;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.LongStream;

@Component
@Profile(value = "git-display")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;
    private final StaticAppInfo staticAppInfo;
    private final PizzaRepository pizzaRepository;
    private int ingredientNumber;
    private final List<String> pizzaImgNames;
    private final List<String> drinkImgNames;
    private final DrinkRepository drinkRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            IngredientRepository ingredientRepository,
            StaticAppInfo staticAppInfo,
            PizzaRepository pizzaRepository,
            DrinkRepository drinkRepository, ReviewRepository reviewRepository, PasswordEncoder passwordEncoder) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.pizzaRepository = pizzaRepository;
        this.ingredientRepository = ingredientRepository;
        this.staticAppInfo = staticAppInfo;
        this.drinkRepository = drinkRepository;
        this.passwordEncoder = passwordEncoder;

        pizzaImgNames = getFileNames(this.staticAppInfo.getUploadPizzaImgDir());
        drinkImgNames = getFileNames(this.staticAppInfo.getUploadDrinkImgDir());
    }


    @Override
    public void run(String... args) throws Exception {
        createDrinks();
        createIngredients();
        createPizzas();
        createUsers();
        createReviews();
    }

    private void createDrinks() {
        List<String> drinkNames = List.of("Fanta", "Pepsi", "Coca Cola", "Woda gazowana", "Mirinda", "Frugo");
        drinkNames.forEach(drinkName -> {
            double price1 = Math.round(ThreadLocalRandom.current().nextDouble(1.5, 2.6) * 100) / (double) 100;
            double price2 = Math.round(ThreadLocalRandom.current().nextDouble(3, 4) * 100) / (double) 100;
            double price3 = Math.round(ThreadLocalRandom.current().nextDouble(4.5, 5.5) * 100) / (double) 100;

            Drink drink = Drink.builder()
                    .name(drinkName)
                    .smallSizePrice(price1)
                    .mediumSizePrice(price2)
                    .bigSizePrice(price3)
                    .imageUrl(getRandomDrinkImageUrl())
                    .build();

            drinkRepository.save(drink);
        });
    }

    private String getRandomDrinkImageUrl() {
        String imageName = this.drinkImgNames.get(new Random().nextInt(this.drinkImgNames.size()));
        return staticAppInfo.getDrinkImgUrlPath() + "/" + imageName;
    }

    private void createIngredients() {
        List<String> ingredientsNames = List.of("Ser", "Mozarella", "Papryka", "Pieczarki", "Pomidor", "Ogórek", "Szynka", "Pepperoni", "Kurczak", "Oliwki", "Salami", "Ananas");
        ingredientNumber = ingredientsNames.size();
        ingredientsNames.forEach(ingredientName -> {
            float price = Math.round(ThreadLocalRandom.current().nextFloat(1.5f, 4.5f) * 100) / 100f;
            Ingredient ingredient = Ingredient.builder().price(price).name(ingredientName).build();
            ingredientRepository.save(ingredient);
        });
    }

    private void createPizzas() {
        List<String> pizzaNames = List.of("Margarita", "Pepperoni", "Capricioza", "Wegetariańska", "Wiosenna", "Hawajska");

        pizzaNames.forEach(pizzaName -> {
            double price1 = Math.round(ThreadLocalRandom.current().nextDouble(19, 24) * 100) / (double) 100;
            double price2 = Math.round(ThreadLocalRandom.current().nextDouble(26, 30) * 100) / (double) 100;
            double price3 = Math.round(ThreadLocalRandom.current().nextDouble(31, 34) * 100) / (double) 100;

            Pizza pizza = Pizza.builder()
                    .name(pizzaName)
                    .smallSizePrice(price1)
                    .mediumSizePrice(price2)
                    .bigSizePrice(price3)
                    .ingredients(ingredientRepository.findAllById(listOfRandomPizzaIngredients()))
                    .imageUrl(getRandomPizzaImageUrlPath())
                    .build();

            pizzaRepository.save(pizza);
            System.out.println("\t-saving pizza: " + pizza);
        });
    }

    private String getRandomPizzaImageUrlPath() {
        String imageName = this.pizzaImgNames.get(new Random().nextInt(this.pizzaImgNames.size()));
        return staticAppInfo.getPizzaImgUrlPath() + "/" + imageName;
    }

    private List<Long> listOfRandomPizzaIngredients() {
        long[] idArray = new long[ingredientNumber];
        for (int i = 0; i < ingredientNumber; i++) {
            idArray[i] = i + 1;
        }

        int numberOfIngredientsOnPizza = ThreadLocalRandom.current().nextInt(1, ingredientNumber + 1);
        List<Long> selectedIngredients = new ArrayList<>();

        for (int i = 0; i < numberOfIngredientsOnPizza; i++) {
            int randomIndex = ThreadLocalRandom.current().nextInt(ingredientNumber);
            selectedIngredients.add(idArray[randomIndex]);
        }

        return selectedIngredients;
    }

    private void createUsers() {
        User admin = User.builder()
                .role(Role.ADMIN)
                .email("admin@gmail.com")
                .password("admin")
                .build();

        userRepository.save(admin);

        User user = User.builder()
                .name("Ty")
                .surname("Lee")
                .email("user@gmail.com")
                .password(passwordEncoder.encode("user"))
                .imageUrl(staticAppInfo.getDefaultUserImgUrl())
                .city("Radom")
                .street("Janusza")
                .houseNumber("23")
                .cityCode("12-123")
                .phoneNumber("111222333")
                .role(Role.USER)
                .build();

        userRepository.save(user);
    }

    private List<String> getFileNames(String directoryPath) {
        List<String> fileNamesList = new ArrayList<>();

        File directory = new File(directoryPath);

        if (directory.isDirectory()) {
            File[] files = directory.listFiles();

            assert files != null;
            for (File file : files) {
                if (file.isFile()) {
                    fileNamesList.add(file.getName());
                }
            }
        }

        return fileNamesList;
    }

    private void createReviews() {
        List<List<Object>> reviewsData = new ArrayList<>(List.of(
                List.of("Nie znoszę tej pizzy, za dużo ananasa", (double) 3),
                List.of("Moja ulubiona", (double) 5),
                List.of("Zamówiliśmy ze znajomymi i wszystkim smakowała!", (double) 4.5),
                List.of("Ciasto trochę za grube, ale ogólnie ok", (double) 4),
                List.of("Niezła", (double) 4),
                List.of("Wolę pierogi", (double) 3)
        ));


        User user = userRepository.findByEmail("user@gmail.com");
        List<Pizza> pizzaList = pizzaRepository.findAll();

        long[] pizzaIdArray = LongStream.rangeClosed(1, pizzaList.size()).toArray();
        int randomNumberOfReviews = ThreadLocalRandom.current().nextInt(1, pizzaList.size());


        for (int i = 0; i < randomNumberOfReviews; i++) {
            int reviewObjectIndexChoice = ThreadLocalRandom.current().nextInt(reviewsData.size());
            List<Object> reviewObject = reviewsData.get(reviewObjectIndexChoice);
            reviewsData.remove(reviewObjectIndexChoice);

            String content = (String) reviewObject.get(0);
            Double stars = (Double) reviewObject.get(1);
            long pizzaIndexChoice = pizzaIdArray[ThreadLocalRandom.current().nextInt(pizzaIdArray.length)];
            Optional<Pizza> pizzaOptional = pizzaRepository.findById(pizzaIndexChoice);
            Pizza pizza = pizzaOptional.orElseThrow();


            Review review = Review.builder()
                    .content(content)
                    .stars(stars)
                    .pizza(pizza)
                    .user(user)
                    .build();

            reviewRepository.save(review);
        }
    }

}