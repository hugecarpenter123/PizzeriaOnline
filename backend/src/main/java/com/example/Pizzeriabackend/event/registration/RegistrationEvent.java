package com.example.Pizzeriabackend.event.registration;

import org.springframework.context.ApplicationEvent;

public class RegistrationEvent extends ApplicationEvent {

    private final String to;
    private final String username;

    public RegistrationEvent(Object source, String to, String username) {
        super(source);
        this.to = to;
        this.username = username;
    }

    public String getTo() {
        return to;
    }

    public String getUsername() {
        return username;
    }
}
