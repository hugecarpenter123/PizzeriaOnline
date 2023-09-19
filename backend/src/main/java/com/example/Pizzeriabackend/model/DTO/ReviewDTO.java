package com.example.Pizzeriabackend.model.DTO;

import com.example.Pizzeriabackend.entity.Review;
import com.example.Pizzeriabackend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private String userFullName;
    private double stars;
    private String content;
    private LocalDateTime createdAt;

    public ReviewDTO(Review review, User user) {
        this.id = review.getId();
        this.userFullName = getUserFullName(user);
        this.stars = review.getStars();
        this.content = review.getContent();
        this.createdAt = review.getCreatedAt();
    }

    private String getUserFullName(User user) {
        return user.getName() + " " + user.getSurname();
    }
}
