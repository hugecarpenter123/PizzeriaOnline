package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.InternalAppCode;
import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.model.util.ServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseServiceImp implements SseService {

    @Autowired
    public ServiceUtils serviceUtils;

    private final List<SseEmitter> workerEmitters = new CopyOnWriteArrayList<>();
    private final Map<Long, SseEmitter> userEmitters = new ConcurrentHashMap<>();

    @Override
    public void pushOrderNotification(Order order) {
        try {
            if (serviceUtils.hasWorkerPerms() && order.getUser() != null) {
                userEmitters.get(order.getUser().getId())
                        .send(SseEmitter.event().name("orderEvent").data(new OrderDTO(order), MediaType.APPLICATION_JSON));
            } else {
                System.out.println("push notification for workerEmitters loop");
                for (SseEmitter emitter : workerEmitters) {
                    System.out.println("\t-emitter: " + emitter);
                    emitter.send(SseEmitter.event().name("orderEvent").data(new OrderDTO(order), MediaType.APPLICATION_JSON));
                }
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

    @Override
    public SseEmitter orderSubscription(Long id) {
        boolean isValidUserSubscription = (id != null) && serviceUtils.getLoggedUser().getId().equals(id);

        if (isValidUserSubscription) {
            SseEmitter emitter = new SseEmitter(1000 * 60 * 5L);
            userEmitters.put(id, emitter);
            System.out.println("user emitter added: " + emitter);

            emitter.onCompletion(() -> userEmitters.remove(id));
            emitter.onTimeout(() -> userEmitters.remove(id));
            emitter.onError((e) -> userEmitters.remove(id));

            return emitter;
        } else if (serviceUtils.hasWorkerPerms()) {
            SseEmitter emitter = new SseEmitter(-1L);
            workerEmitters.add(emitter);
            System.out.println("staff emitter added: " + emitter);

            emitter.onCompletion(() -> workerEmitters.remove(emitter));
            emitter.onTimeout(() -> workerEmitters.remove(emitter));
            emitter.onError((e) -> workerEmitters.remove(emitter));

            return emitter;
        } else {
            throw new GeneralBadRequestException("Invalid orderEvent subscription", InternalAppCode.INVALID_EVENT_SUBSCRIPTION);
        }
    }
}
