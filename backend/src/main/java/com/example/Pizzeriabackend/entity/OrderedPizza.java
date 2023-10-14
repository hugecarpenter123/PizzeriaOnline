package com.example.Pizzeriabackend.entity;

import com.example.Pizzeriabackend.entity.enums.PizzaSizes;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderedPizza {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    private Pizza pizza;

    private PizzaSizes size;

    private int quantity;

    public double getTotalPrice() {
        return pizza.getPrice(size) * quantity;
    }
}

