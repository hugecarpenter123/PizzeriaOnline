package com.example.Pizzeriabackend.exception;

import lombok.Getter;

@Getter
public class GeneralBadRequestException extends RuntimeException {
    private final String message;
    private final InternalAppCode internalAppCode;

    public GeneralBadRequestException(String message, InternalAppCode internalAppCode) {
        this.message = message;
        this.internalAppCode = internalAppCode;
    }

    public GeneralBadRequestException(String message) {
        this.message = message;
        this.internalAppCode = null;
    }
}
