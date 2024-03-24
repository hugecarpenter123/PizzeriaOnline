package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.*;
import com.example.Pizzeriabackend.entity.enums.OrderStatus;
import com.example.Pizzeriabackend.entity.enums.OrderType;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.exception.InternalAppCode;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.model.request.CreateOrderRequest;
import com.example.Pizzeriabackend.model.request.OrderStatusRequest;
import com.example.Pizzeriabackend.model.request.OrderedDrinkModel;
import com.example.Pizzeriabackend.model.request.OrderedPizzaModel;
import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.repository.*;
import com.example.Pizzeriabackend.util.ServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class OrderServiceImp implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderedPizzaRepository orderedPizzaRepository;

    @Autowired
    private OrderedDrinkRepository orderedDrinkRepository;

    @Autowired
    private PizzaRepository pizzaRepository;

    @Autowired
    private DrinkRepository drinkRepository;

    @Autowired
    private ServiceUtils serviceUtils;

    @Autowired
    private SseService notificationService;


    @Override
    public OrderDTO createOrder(CreateOrderRequest createOrderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        boolean isLoggedIn = authentication.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals(Role.USER.name()));

        boolean atLeastOneOrder = ((createOrderRequest.getOrderedPizzas() != null && !createOrderRequest.getOrderedPizzas().isEmpty())
                || (createOrderRequest.getOrderedDrinks() != null && !createOrderRequest.getOrderedDrinks().isEmpty()));
        boolean hasOrderType = createOrderRequest.getOrderType() != null
                && (createOrderRequest.getOrderType().equals(OrderType.DELIVERY) || createOrderRequest.getOrderType().equals(OrderType.PICKUP));
        boolean containsAddress = createOrderRequest.getDeliveryAddress() != null && !createOrderRequest.getDeliveryAddress().isEmpty()
                && createOrderRequest.getOrdererName() != null && !createOrderRequest.getOrdererName().isEmpty();
        boolean isForDelivery = createOrderRequest.getOrderType().equals(OrderType.DELIVERY);
        boolean containsOrdererName = createOrderRequest.getOrdererName() != null && !createOrderRequest.getOrdererName().isEmpty();
        boolean containsContact = createOrderRequest.getPhone() != null && !createOrderRequest.getPhone().isEmpty();

        boolean hasDeliveryInfo = containsContact && containsOrdererName && containsAddress;
        boolean hasPickupInfo = containsContact && containsOrdererName;


        boolean isOrderModelOk = atLeastOneOrder
                && hasOrderType
                && (isLoggedIn || ((isForDelivery && hasDeliveryInfo) || (!isForDelivery && hasPickupInfo)));

        if (!isOrderModelOk) {
            throw new GeneralBadRequestException("Order information are filled improperly");
        }

        List<OrderedDrinkModel> orderedDrinkModels = createOrderRequest.getOrderedDrinks();
        List<OrderedPizzaModel> orderedPizzaModels = createOrderRequest.getOrderedPizzas();

        Order order = new Order();
        order.setOrderType(createOrderRequest.getOrderType());
        order.setStatus(OrderStatus.PENDING);
        order.setLookupId(UUID.randomUUID().toString());
        if (isLoggedIn) {
            User user = userRepository.findByEmail(email);
            order.setUser(user);
            order.setOrdererName(user.getName() + " " + user.getSurname());

            // if contact changed for the order, set accordingly - else default
            if (containsContact) {
                order.setPhone(createOrderRequest.getPhone());
            } else {
                order.setPhone(user.getPhoneNumber());
            }

            if (createOrderRequest.getOrderType().equals(OrderType.DELIVERY)) {
                if (createOrderRequest.getDeliveryAddress() != null && !createOrderRequest.getDeliveryAddress().isEmpty()) {
                    order.setDeliveryAddress(createOrderRequest.getDeliveryAddress());
                } else {
                    String deliveryAddress = String.format(
                            "%s %s, %s %s", user.getStreet(), user.getHouseNumber(), user.getCityCode(), user.getCity()
                    );
                    order.setDeliveryAddress(deliveryAddress);
                }
                System.out.println("for delivery info - done");
            }
        } else {
            order.setOrdererName(createOrderRequest.getOrdererName());
            order.setPhone(createOrderRequest.getPhone());
            // if not-logged user has chosen DELIVERY, save address data
            if (createOrderRequest.getOrderType().equals(OrderType.DELIVERY)) {
                order.setDeliveryAddress(createOrderRequest.getDeliveryAddress());
            }
        }

        Order createdOrder = orderRepository.save(order);

        if (!orderedPizzaModels.isEmpty()) {
            List<OrderedPizza> orderedPizzas = parseOrderedPizzaModel(orderedPizzaModels, createdOrder);
            createdOrder.setOrderedPizzas(orderedPizzas);
        } else {
            // assign empty list - otherwise NullPointerException
            createdOrder.setOrderedPizzas(new ArrayList<>());
        }


        if (!orderedDrinkModels.isEmpty()) {
            List<OrderedDrink> orderedDrinks = parseOrderedDrinkModel(orderedDrinkModels, createdOrder);
            createdOrder.setOrderedDrinks(orderedDrinks);
        } else {
            // assign empty list - otherwise NullPointerException
            createdOrder.setOrderedDrinks(new ArrayList<>());
        }

        notificationService.pushOrderNotification(createdOrder);
        return new OrderDTO(createdOrder);
    }

    /**
     * Method takes parsed into List<orderedPizzaModel> elements, iterates through all and creates
     * corresponding OrderedPizza objects which are later appended to a list, which finally is returned.
     * This list is then ready to set into given Order
     *
     * @param orderedPizzaModels takes parsed into given model JSON request body
     * @param order              takes Order to which OrderedPizza will be assigned
     * @return ready to set to an Order required List of OrderedPizzas (ManyToOne relationship)
     */
    private List<OrderedPizza> parseOrderedPizzaModel(List<OrderedPizzaModel> orderedPizzaModels, Order order) {
        List<OrderedPizza> orderedPizzas = new ArrayList<>();
        for (OrderedPizzaModel orderedPizzaModel : orderedPizzaModels) {
            Pizza pizza = pizzaRepository.findById(orderedPizzaModel.getPizzaId()).orElseThrow();
            OrderedPizza orderedPizza = OrderedPizza.builder()
                    .order(order)
                    .pizza(pizza)
                    .size(orderedPizzaModel.getSize())
                    .quantity(orderedPizzaModel.getQuantity())
                    .build();

            orderedPizzas.add(orderedPizzaRepository.save(orderedPizza));
        }

        return orderedPizzas;
    }

    /**
     * Method created for DataInitializer Bean without validation and with simplified form
     * @param createOrderRequest simulated order creation request
     */
    public void createOrderForInitialization(CreateOrderRequest createOrderRequest) {
        List<OrderedDrinkModel> orderedDrinkModels = createOrderRequest.getOrderedDrinks();
        List<OrderedPizzaModel> orderedPizzaModels = createOrderRequest.getOrderedPizzas();

        Order order = new Order();
        order.setOrderType(createOrderRequest.getOrderType());
        order.setStatus(OrderStatus.PENDING);
        order.setLookupId(UUID.randomUUID().toString());
        order.setOrdererName(createOrderRequest.getOrdererName());
        order.setPhone(createOrderRequest.getPhone());

        // if not-logged user has chosen DELIVERY, save address data, else address is not needed
        if (createOrderRequest.getOrderType().equals(OrderType.DELIVERY)) {
            order.setDeliveryAddress(createOrderRequest.getDeliveryAddress());
        }

        orderRepository.save(order);

        order.setOrderedPizzas(
                !orderedPizzaModels.isEmpty()
                        ? parseOrderedPizzaModel(orderedPizzaModels, order)
                        : Collections.emptyList()
        );

        order.setOrderedDrinks(
                !orderedDrinkModels.isEmpty()
                        ? parseOrderedDrinkModel(orderedDrinkModels, order)
                        : Collections.emptyList()
        );
//        System.out.printf("\norder saved successfully: \n\tid:%s, \n\tpizzas: %s, \n\tdrinks: %s, \n\tordererName: %s" +
//                "\n\torderType: %s\n\torderStatus: %s\n\taddress: %s\n",
//                order.getId(), order.getOrderedPizzas().stream().map(op -> op.getPizza().getName()).toList(),
//                order.getOrderedDrinks().stream().map(od -> od.getDrink().getName()).toList(),
//                order.getOrdererName(), order.getOrderType(), order.getStatus(), order.getDeliveryAddress());
    }

    /**
     * Method takes parsed into List<orderedDrinkModel> elements, iterates through all and creates
     * corresponding OrderedDrink objects which are later appended to a list, which finally is returned.
     * This list is then ready to set into given Order
     *
     * @param orderedDrinkModels takes parsed into given model JSON request body
     * @param order              takes Order to which OrderedDrink will be attached
     * @return ready to set to an Order required List of OrderedDrink (ManyToOne relationship)
     */
    private List<OrderedDrink> parseOrderedDrinkModel(List<OrderedDrinkModel> orderedDrinkModels, Order order) {
        List<OrderedDrink> orderedDrinks = new ArrayList<>();
        for (OrderedDrinkModel orderedDrinkModel : orderedDrinkModels) {
            Drink drink = drinkRepository.findById(orderedDrinkModel.getDrinkId()).orElseThrow();
            OrderedDrink orderedDrink = OrderedDrink.builder()
                    .order(order)
                    .drink(drink)
                    .size(orderedDrinkModel.getSize())
                    .quantity(orderedDrinkModel.getQuantity())
                    .build();

            orderedDrinks.add(orderedDrinkRepository.save(orderedDrink));
        }
        return orderedDrinks;
    }


    @Override
    public OrderDTO getOrder(long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Order not found"));
        return new OrderDTO(order);
    }

    @Override
    public List<OrderDTO> getMyOrders() {
        User user = serviceUtils.getLoggedUser();
        return user.getOrders().stream().map(OrderDTO::new).toList();
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(OrderDTO::new).toList();
    }

    @Override
    public List<OrderDTO> getUserOrders(long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new GeneralNotFoundException("User with provided id doesn't exist", InternalAppCode.USER_NOT_FOUND));
        return user.getOrders().stream().map(OrderDTO::new).toList();
    }

    /**
     * Database operation is performed only if requester is: ADMIN | WORKER | owner of the Order resource.
     */
    @Override
    public void updateOrderStatus(OrderStatusRequest orderStatusModel) {
        if (!orderStatusModel.isValid()) {
            throw new GeneralBadRequestException("Order status model is filled improperly", InternalAppCode.IMPROPER_MODEL);
        }

        Order order = orderRepository.findById(orderStatusModel.getOrderId())
                .orElseThrow(() -> new GeneralNotFoundException("Order with provided id doesn't exist", InternalAppCode.RESOURCE_NOT_FOUND));

        order.setStatus(orderStatusModel.getOrderStatus());
        orderRepository.save(order);

        notificationService.pushOrderNotification(order);
    }

    @Override
    public OrderDTO getOrderByLookupId(String lookupId) {
        Order order = orderRepository.findByLookupId(lookupId).orElseThrow(
                () -> new GeneralNotFoundException("Order of this lookup id doesn't exist", InternalAppCode.RESOURCE_NOT_FOUND)
        );
        return new OrderDTO(order);
    }

    @Override
    public List<OrderDTO> getUnfinishedOrders() {
        return orderRepository.findByStatusNotIn(List.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED))
                .stream().map(OrderDTO::new).toList();
    }

    @Override
    public void deleteOrder(long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public void cancelOrder(long id) {
        User user = serviceUtils.getLoggedUser();
        Order order = orderRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Order not found"));

        if (user != order.getUser()) {
            throw new NoUserPermissionException("Requester is not authorized to perform this operation");
        }

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Override
    public void deleteAllOrders() {
        orderRepository.deleteAll();
    }

}
