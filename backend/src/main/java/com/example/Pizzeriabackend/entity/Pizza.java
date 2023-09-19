package com.example.Pizzeriabackend.entity;

import com.example.Pizzeriabackend.util.StaticAppInfo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pizza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;

    @ManyToMany
    private List<Ingredient> ingredients;

    @OneToMany(mappedBy = "pizza", cascade = CascadeType.ALL)
    private List<Review> reviews;
    private String imageUrl;

    public double getPrice(PizzaSizes size) {
        return switch (size) {
            case SMALL -> smallSizePrice;
            case MEDIUM -> mediumSizePrice;
            case BIG -> bigSizePrice;
            default -> 0.0;
        };
    }
}
