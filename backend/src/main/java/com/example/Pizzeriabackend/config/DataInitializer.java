package com.example.Pizzeriabackend.config;

import com.example.Pizzeriabackend.entity.*;
import com.example.Pizzeriabackend.entity.enums.DrinkSizes;
import com.example.Pizzeriabackend.entity.enums.OrderType;
import com.example.Pizzeriabackend.entity.enums.PizzaSizes;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.model.request.OrderedDrinkModel;
import com.example.Pizzeriabackend.model.request.CreateOrderRequest;
import com.example.Pizzeriabackend.model.request.OrderedPizzaModel;
import com.example.Pizzeriabackend.repository.*;
import com.example.Pizzeriabackend.service.OrderService;
import com.example.Pizzeriabackend.service.OrderServiceImp;
import com.example.Pizzeriabackend.util.DateDeserializer;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;
import java.util.stream.LongStream;
import java.util.stream.Stream;

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
    private final OrderServiceImp orderService;

    public DataInitializer(
            UserRepository userRepository,
            IngredientRepository ingredientRepository,
            StaticAppInfo staticAppInfo,
            PizzaRepository pizzaRepository,
            DrinkRepository drinkRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder,
            OrderServiceImp orderService) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.pizzaRepository = pizzaRepository;
        this.ingredientRepository = ingredientRepository;
        this.staticAppInfo = staticAppInfo;
        this.drinkRepository = drinkRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderService = orderService;

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
        createOrders();
    }

    private void createOrders() {
//        Optional<User> optionalUser = userRepository.findById(1L);
//        User user = optionalUser.orElse(null);
//        if (user == null) return;
        String[] namesArr = {"Maciej Brzuchacz", "Karolina Pudliszki", "Marcel Wałbrzych", "Sebastian Moniczka"};
        String[] phonesArr = {"123123123", "345464723", "957625122", "070000654"};
        String[] addressees = {"Majowa 23d, 44-234 Zabrze", "Lipna 23, 69-213 Stalingrad", "Malibu 88, 23-111 Katowice"};
        Random random = new Random();

        Long[] pizzaIds = pizzaRepository.findAll().stream().map(Pizza::getId).toArray(Long[]::new);
        Long[] drinkIds = drinkRepository.findAll().stream().map(Drink::getId).toArray(Long[]::new);
        PizzaSizes[] pizzaSizes = PizzaSizes.values();
        DrinkSizes[] drinkSizes = DrinkSizes.values();

        Stream.generate(() -> {
                    int pizzasNumber = random.nextInt(1, 4);
                    int drinksNumber = random.nextInt(1, 3);
                    List<OrderedPizzaModel> orderedPizzaModels = Stream.generate(() -> {
                                int pizzaQuantity = random.nextInt(1, 2);
                                return new OrderedPizzaModel(
                                        pizzaIds[random.nextInt(pizzaIds.length)],
                                        pizzaSizes[random.nextInt(pizzaSizes.length)],
                                        pizzaQuantity
                                );
                            })
                            .limit(pizzasNumber)
                            .toList();

                    List<OrderedDrinkModel> orderedDrinkModels = Stream.generate(() -> {
                                int drinkQuantity = random.nextInt(1, 2);
                                return new OrderedDrinkModel(
                                        drinkIds[random.nextInt(drinkIds.length)],
                                        drinkQuantity,
                                        drinkSizes[random.nextInt(drinkSizes.length)]
                                );
                            })
                            .limit(drinksNumber)
                            .toList();


                    return CreateOrderRequest.builder()
                            .orderType((List.of(OrderType.DELIVERY, OrderType.PICKUP).get(random.nextInt(0, 2))))
                            .ordererName(namesArr[random.nextInt(namesArr.length)])
                            .deliveryAddress(addressees[random.nextInt(addressees.length)])
                            .phone(phonesArr[random.nextInt(phonesArr.length)])
                            .orderedPizzas(orderedPizzaModels)
                            .orderedDrinks(orderedDrinkModels)
                            .build();
                })
                .limit(random.nextInt(4, 8))
                .forEach(orderService::createOrderForInitialization);

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
                .name("Admino")
                .surname("Domino")
                .role(Role.ADMIN)
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("admin"))
                .build();

        userRepository.save(admin);

        User staffMember = User.builder()
                .name("Elstaffo")
                .surname("Membrano")
                .role(Role.WORKER)
                .email("staff@gmail.com")
                .password(passwordEncoder.encode("staff"))
                .build();

        userRepository.save(staffMember);

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
                .dateOfBirth(DateDeserializer.parseDate("04-04-1998"))
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
