package com.example.Pizzeriabackend.model.DTO;

import com.example.Pizzeriabackend.entity.Ingredient;
import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PizzaDTO {
    private long id;
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;
    private List<String> ingredients;
    private List<ReviewDTO> reviews;
    private String imageUrl;

    public PizzaDTO(Pizza pizza) {
        this.id = pizza.getId();
        this.name = pizza.getName();
        this.smallSizePrice = pizza.getSmallSizePrice();
        this.mediumSizePrice = pizza.getMediumSizePrice();
        this.bigSizePrice = pizza.getBigSizePrice();
        this.ingredients = parseIngredients(pizza);
        this.reviews = parseReviews(pizza);
        this.imageUrl = pizza.getImageUrl();
    }

    private List<String> parseIngredients(Pizza pizza) {
        System.out.println("parseIngredients: " + pizza.getIngredients());
        return pizza.getIngredients().stream().map(
                Ingredient::getName
        ).toList();
    }

    private List<ReviewDTO> parseReviews(Pizza pizza) {
        return pizza.getReviews().stream().map(
                review -> {
                    User user = review.getUser();
                    return ReviewDTO.builder()
                            .id(review.getId())
                            .userFullName(user.getName() + " " + user.getSurname())
                            .stars(review.getStars())
                            .content(review.getContent())
                            .createdAt(review.getCreatedAt())
                            .build();
                }
        ).toList();
    }
}
