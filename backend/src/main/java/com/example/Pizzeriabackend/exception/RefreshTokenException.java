package com.example.Pizzeriabackend.exception;

import lombok.Getter;

@Getter
public class RefreshTokenException extends RuntimeException {
    private final String message;
    private final InternalAppCode internalAppCode;

    public RefreshTokenException(String message, InternalAppCode internalAppCode) {
        this.message = message;
        this.internalAppCode = internalAppCode;
    }

    public RefreshTokenException(String message) {
        this.message = message;
        this.internalAppCode = null;
    }
}
