package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.entity.enums.OrderType;
import com.example.Pizzeriabackend.model.request.CreateOrderRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/sse")
public class SSeController {

    public List<SseEmitter> orderPidckerEmiters = new CopyOnWriteArrayList<>();
    public Map<Long, SseEmitter> orderMakersEmitters = new ConcurrentHashMap<>();


    @PostMapping("/order")
    public void placeOrder(@RequestBody CreateOrderRequest orderRequest) {
        // Wywołanie serwisu i przekazanie obiektu po zapisie w bazie danych
        Order fictionalOrder = Order.builder()
                .orderedPizzas(new ArrayList<>())
                .orderedDrinks(new ArrayList<>())
                .orderType(OrderType.DELIVERY)
                .ordererName("Arkadiusz Bernando")
                .deliveryAddress("dupanowice")
                .phone("123123123")
                .user(null)
                .build();

        pushNotification(fictionalOrder, "order-picker");
    }

    @PutMapping("/order")
    public void updateOrder(@RequestBody CreateOrderRequest orderRequest) {
        boolean requestFromUser = new Random().nextBoolean();

        Order fictionalOrder = Order.builder()
                .orderedPizzas(new ArrayList<>())
                .orderedDrinks(new ArrayList<>())
                .orderType(OrderType.DELIVERY)
                .ordererName(orderRequest.getOrdererName())
                .deliveryAddress(null)
                .phone(null)
                .user(null)
                .build();

        if (requestFromUser) {
            // poinformuj wszystkich order-pickerów
            for (SseEmitter emitter : orderPidckerEmiters) {
                try {
                    emitter.send(SseEmitter.event().name("simpleEvent").data(fictionalOrder, MediaType.APPLICATION_JSON));
                } catch (IOException e) {
                    System.out.println("Error occurred during emitting");
                }
            }
        }
        // Wywołanie serwisu i przekazanie obiektu po zapisie w bazie danych
        Map<String, String> order = Map.of("order", "some order arrived " + System.currentTimeMillis());

        // Wysyłanie informacji o nowym zamówieniu do aplikacji restauracji (do wszystkich stanowisk jakie są)
        for (SseEmitter emitter : orderPidckerEmiters) {
            try {
                emitter.send(SseEmitter.event().name("simpleEvent").data(order, MediaType.APPLICATION_JSON));
            } catch (IOException e) {
                System.out.println("Error occurred during emitting");
            }
        }
    }

    private void pushNotification(Order order, String to) {
        if (to.equals("order-picker")) {
            System.out.println("emitters for loop:");
            for (SseEmitter emitter : orderPidckerEmiters) {
                System.out.println("----Emitter: " + emitter);
                try {
                    emitter.send(SseEmitter.event().name("simpleEvent").data(order, MediaType.APPLICATION_JSON));
                } catch (IOException e) {
                    System.out.println(e.getMessage());
                }
            }
        } else if (to.equals("order-maker") && order.getUser() != null) {
            try {
                orderMakersEmitters.get(order.getUser().getId())
                        .send(SseEmitter.event().name("simpleEvent").data(order, MediaType.APPLICATION_JSON));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }


    @CrossOrigin
    @GetMapping("/order-picker")
    public SseEmitter orderPickerSubscribe() {
        SseEmitter emitter = new SseEmitter(-1L);
        orderPidckerEmiters.add(emitter);
        System.out.println(emitter + " - registered");

        emitter.onCompletion(() -> {
            System.out.println(emitter + " - onCompletion()");
            orderPidckerEmiters.remove(emitter);
            System.out.println(emitter + " - unregistered...");
        });
        emitter.onTimeout(() -> {
            System.out.println(emitter + " - onTimeout()");
            orderPidckerEmiters.remove(emitter);
        });
        emitter.onError((e) -> {
            System.out.println(emitter + " - onError()");
            orderPidckerEmiters.remove(emitter);
        });

        return emitter;
    }

    @GetMapping("/order-maker/{id}")
    public SseEmitter orderMakerSubscribe(@PathVariable Long id) {
        System.out.println("orderMakerSubscribe with id: " + id);
        SseEmitter emitter = new SseEmitter();
        orderMakersEmitters.put(id, emitter);

        emitter.onCompletion(() -> orderPidckerEmiters.remove(emitter));
        emitter.onTimeout(() -> orderPidckerEmiters.remove(emitter));
        emitter.onError((e) -> {
            System.out.println(e.getMessage());
            orderMakersEmitters.remove(id);
        });

        return emitter;
    }
}
