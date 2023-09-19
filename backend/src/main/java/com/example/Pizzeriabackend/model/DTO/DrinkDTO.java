package com.example.Pizzeriabackend.model.DTO;

import com.example.Pizzeriabackend.entity.Drink;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrinkDTO {
    private Long id;
    private String name;
    private double smallSizePrice;
    private double mediumSizePrice;
    private double bigSizePrice;
    private String imageUrl;

    public DrinkDTO(Drink drink) {
        this.id = drink.getId();
        this.name = drink.getName();
        this.smallSizePrice = drink.getSmallSizePrice();
        this.mediumSizePrice = drink.getMediumSizePrice();
        this.bigSizePrice = drink.getBigSizePrice();
        this.imageUrl = drink.getImageUrl();
    }
}
