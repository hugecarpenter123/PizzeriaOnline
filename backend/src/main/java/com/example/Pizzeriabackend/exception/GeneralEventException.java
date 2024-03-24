package com.example.Pizzeriabackend.exception;

import lombok.Getter;

@Getter
public class GeneralEventException extends RuntimeException {
    private final String message;
    private final InternalAppCode internalAppCode;

    public GeneralEventException(String message, InternalAppCode internalAppCode) {
        this.message = message;
        this.internalAppCode = internalAppCode;
    }

    public GeneralEventException(String message) {
        this.message = message;
        this.internalAppCode = null;
    }
}

