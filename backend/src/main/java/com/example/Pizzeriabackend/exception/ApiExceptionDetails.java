package com.example.Pizzeriabackend.exception;

import lombok.*;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ApiExceptionDetails {
    private final String message;
    private final HttpStatus httpStatus;
    private final InternalAppCode internalAppCode;

    public ApiExceptionDetails(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
        this.internalAppCode = null;
    }
}
