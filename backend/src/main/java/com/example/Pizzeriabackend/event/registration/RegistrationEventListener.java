package com.example.Pizzeriabackend.event.registration;

import com.example.Pizzeriabackend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class RegistrationEventListener {
    @Autowired
    private EmailService emailService;

    @EventListener
    public void handleRegistrationEvent(RegistrationEvent event) {
        String to = event.getTo();
        String username = event.getUsername();
        emailService.sendRegistrationEmail(to, username);
    }
}
