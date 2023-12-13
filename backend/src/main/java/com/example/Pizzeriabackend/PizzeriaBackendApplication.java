package com.example.Pizzeriabackend;

import com.example.Pizzeriabackend.repository.DrinkRepository;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.service.DrinksService;
import com.example.Pizzeriabackend.service.PizzaService;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Iterator;

@SpringBootApplication
public class PizzeriaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PizzeriaBackendApplication.class, args);
    }
}
