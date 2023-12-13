package com.example.Pizzeriabackend.model.response;

import com.example.Pizzeriabackend.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReviewDTO {
    private Long id;
    private Long pizzaId;
    private String imageUrl;
    private String pizzaName;
    private double stars;
    private String content;
    private LocalDateTime createdAt;

    public UserReviewDTO(Review review) {
        this.id = review.getId();
        this.pizzaId = review.getPizza().getId();
        this.imageUrl = review.getPizza().getImageUrl();
        this.pizzaName = review.getPizza().getName();
        this.stars = review.getStars();
        this.content = review.getContent();
        this.createdAt = review.getCreatedAt();
    }
}
