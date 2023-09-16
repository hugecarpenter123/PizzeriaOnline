package com.example.Pizzeriabackend.exception;

public class NoUserPermissionException extends RuntimeException {
    public NoUserPermissionException(String message) {
        super(message);
    }
}
