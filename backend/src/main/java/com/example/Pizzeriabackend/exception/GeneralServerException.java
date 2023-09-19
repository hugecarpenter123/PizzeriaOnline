package com.example.Pizzeriabackend.exception;

public class GeneralServerException extends RuntimeException {
    public GeneralServerException(String message) {
        super(message);
    }
}
