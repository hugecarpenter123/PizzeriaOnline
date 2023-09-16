package com.example.Pizzeriabackend.exception;

public class DateParsingException extends RuntimeException {
    public DateParsingException(String message, Throwable cause) {
        super(message, cause);
    }
    public DateParsingException(String message) {
        super(message);
    }
}
