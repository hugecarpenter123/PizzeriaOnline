package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/menu")
public class MenuController {
    @Autowired
    private MenuService menuService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMenu() {
        return ResponseEntity.ok().body(Map.of("result", menuService.getMenu()));
    }
}
