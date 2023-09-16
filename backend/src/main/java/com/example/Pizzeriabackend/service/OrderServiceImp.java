package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.*;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.model.DTO.OrderDTO;
import com.example.Pizzeriabackend.model.DTO.OrderedDrinkDto;
import com.example.Pizzeriabackend.model.DTO.OrderedPizzaDto;
import com.example.Pizzeriabackend.model.OrderModel;
import com.example.Pizzeriabackend.model.OrderedDrinkModel;
import com.example.Pizzeriabackend.model.OrderedPizzaModel;
import com.example.Pizzeriabackend.model.PizzaModel;
import com.example.Pizzeriabackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    @Override
    public OrderDTO createOrder(OrderModel orderModel) {
        System.out.println("public OrderDTO createOrder() +++++++++++++++++++++++++++++++++");
        // check whether this request is done from a logged user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        boolean isLoggedIn = authentication.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals(Role.USER.name()));
        System.out.println("has USER auth: " + isLoggedIn);
        System.out.println("OrderModel: " + orderModel);

        boolean atLeastOneOrder = ((orderModel.getOrderedPizzas() != null && !orderModel.getOrderedPizzas().isEmpty())
                || (orderModel.getOrderedDrinks() != null && !orderModel.getOrderedDrinks().isEmpty()));
        boolean hasOrderType = orderModel.getOrderType() != null
                && (orderModel.getOrderType().equals(OrderType.DELIVERY) || orderModel.getOrderType().equals(OrderType.PICKUP));
        boolean containsAddress = orderModel.getDeliveryAddress() != null && !orderModel.getDeliveryAddress().isEmpty()
                && orderModel.getOrdererName() != null && !orderModel.getOrdererName().isEmpty();
        boolean isForDelivery = orderModel.getOrderType().equals(OrderType.DELIVERY);
        boolean containsOrdererName = orderModel.getOrdererName() != null && !orderModel.getOrdererName().isEmpty();
        boolean containsContact = orderModel.getPhone() != null && !orderModel.getPhone().isEmpty();

        boolean hasDeliveryInfo = containsContact && containsOrdererName && containsAddress;
        boolean hasPickupInfo = containsContact && containsOrdererName;


        boolean isOrderModelOk = atLeastOneOrder
                && hasOrderType
                && (isLoggedIn || ((isForDelivery && hasDeliveryInfo) || (!isForDelivery && hasPickupInfo)));

        if (!isOrderModelOk) {
            // shouldn't happen in well performed UI
            throw new GeneralBadRequestException("Order information are filled improperly");
        }

        // get list of orders and check validate them later
        List<OrderedDrinkModel> orderedDrinkModels = orderModel.getOrderedDrinks();
        List<OrderedPizzaModel> orderedPizzaModels = orderModel.getOrderedPizzas();

        System.out.println("-----------------------Order completion---------------------------");
        Order order = new Order();
        order.setOrderType(orderModel.getOrderType());
        System.out.println("order.setOrderType(orderModel.getOrderType()) - done");
        order.setStatus(OrderStatus.PENDING);
        System.out.println("order.setStatus(OrderStatus.PENDING) - done");
        // if is logged in (present valid bearer token)
        if (isLoggedIn) {
            System.out.println("userLoggedIn ifBlock=========");
            // if both won't print then the error is here
            User user = userRepository.findByEmail(email);
            order.setUser(user);
            System.out.println("order.setUser(user) - done");

            // having user, set ordererName from that
            order.setOrdererName(user.getName() + " " + user.getSurname());
            System.out.println("order.setOrdererName(user.getName() + \" \" + user.getSurname()) - done");

            // if contact changed for the order, set accordingly - else default
            if (containsContact) {
                order.setPhone(orderModel.getPhone());
            } else {
                order.setPhone(user.getPhoneNumber());
            }
            System.out.println("phone - done");

            // if order is for DELIVERY
            if (orderModel.getOrderType().equals(OrderType.DELIVERY)) {
                // if DELIVERY address is different from registration users address then set given
                if (orderModel.getDeliveryAddress() != null && !orderModel.getDeliveryAddress().isEmpty()) {
                    order.setDeliveryAddress(orderModel.getDeliveryAddress());
                } else {
                    // DELIVERY address is same as at the registration
                    // set default delivery address from registered user
                    String deliveryAddress = String.format(
                            "%s %s, %s %s", user.getStreet(), user.getHouseNumber(), user.getCityCode(), user.getCity()
                    );
                    order.setDeliveryAddress(deliveryAddress);
                }
                System.out.println("for delivery info - done");
            }
            // order made without registration, fill provided necessary data
        } else {
            // user not logged in, save name and contact
            order.setOrdererName(orderModel.getOrdererName());
            order.setPhone(orderModel.getPhone());
            // if not-logged user has chosen DELIVERY, save address data
            if (orderModel.getOrderType().equals(OrderType.DELIVERY)) {
                order.setDeliveryAddress(orderModel.getDeliveryAddress());
            }
        }

        // first save the order, then fill rest of the info 
        Order createdOrder = orderRepository.save(order);
        // at this point, Order needs to have ordered elements attached
        System.out.println("Order initially created: " + createdOrder);

        // validate order lists
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

        // no matter what was set (empty or full, always save)
        orderRepository.save(createdOrder);

        // created constructor can receive Order object and return DTO obj
        // return generateOrderResponseObject(createdOrder);
        return new OrderDTO(createdOrder);
    }

    /**
     * Method takes parsed into List<orderedPizzaModel> elements, iterates through all and creates
     * corresponding OrderedPizza objects which are later appended to a list, which finally is returned.
     * This list is then ready to set into given Order
     *
     * @param orderedPizzaModels takes parsed into given model JSON request body
     * @param order              takes Order to which OrderedPizza is assigned
     * @return ready to set to an Order required List of OrderedPizzas (ManyToOne relationship)
     */
    private List<OrderedPizza> parseOrderedPizzaModel(List<OrderedPizzaModel> orderedPizzaModels, Order order) {
        List<OrderedPizza> orderedPizzas = new ArrayList<>();
        for (OrderedPizzaModel orderedPizzaModel : orderedPizzaModels) {
            System.out.println("\t-> OrderedPizzaModel orderedPizzaModel : orderedPizzaModels");
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
        System.out.println("--------------parseOrderedDrinkModel() - done");
        return orderedDrinks;
    }

    // TODO: 27.06.2023 remove, because same logic is implemented as DTO constructor
    public OrderDTO generateOrderResponseObject(Order order) {
        // build list of OrderedPizzaDto which is a part of an Order model to be returned
        List<OrderedPizzaDto> orderedPizzaDtoList = order.getOrderedPizzas().stream().map(
                        orderedPizza -> OrderedPizzaDto.builder()
                                .name(orderedPizza.getPizza().getName())
                                .size(orderedPizza.getSize().name())
                                .quantity(orderedPizza.getQuantity())
                                .build())
                .toList();

        // build list of OrderedDrinkDto which is a part of an Order model to be returned
        List<OrderedDrinkDto> orderedDrinkDtoList = order.getOrderedDrinks().stream().map(
                        orderedDrink -> OrderedDrinkDto.builder()
                                .name(orderedDrink.getDrink().getName())
                                .size(orderedDrink.getSize().name())
                                .quantity(orderedDrink.getQuantity())
                                .build())
                .toList();

        return OrderDTO.builder()
                .order_id(order.getId())
                .ordererName(order.getOrdererName())
                .orderedPizzas(orderedPizzaDtoList)
                .orderedDrinks(orderedDrinkDtoList)
                .deliveryAddress(order.getDeliveryAddress())
                .orderStatus(order.getStatus())
                .build();
    }

    @Override
    public Order getOrder(long id) {
        return orderRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Order not found"));
    }

    @Override
    public List<Order> getOrders() {
        return orderRepository.findAll();
    }

    @Override
    public void deleteOrder(long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public void cancelOrder(long id) {
        User user = getLoggedUser();
        Order order = orderRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Order not found"));

        // this check is necessary because it's not enough to have USER perms, given review must also belong to the same requester
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

    private User getLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserAuthority = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.USER.name()));
        if (hasUserAuthority) {
            return userRepository.findByEmail(authentication.getName());
        } else {
            throw new NoUserPermissionException("Request denied due to no USER permissions");
        }
    }
}
