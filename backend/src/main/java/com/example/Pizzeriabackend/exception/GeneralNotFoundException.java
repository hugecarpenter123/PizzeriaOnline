package com.example.Pizzeriabackend.exception;

public class GeneralNotFoundException extends RuntimeException {
    private final String message;
    private final InternalAppCode internalAppCode;
    public GeneralNotFoundException(String message, InternalAppCode internalAppCode) {
        this.message = message;
        this.internalAppCode = internalAppCode;
    }

    public GeneralNotFoundException(String message) {
        this.message = message;
        this.internalAppCode = null;
    }
}
