package com.example.Pizzeriabackend.model.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ResponseTemplate {
    public static <T> ResponseEntity<Map<String, T>> success(HttpStatus status, T result) {
        Map<String, T> response = new HashMap<>();
        response.put("result", result);
        return ResponseEntity.status(status).body(response);
    }
}
