package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.model.DTO.ReviewDTO;
import com.example.Pizzeriabackend.model.ReviewModel;

public interface ReviewService {
    ReviewDTO createReview(ReviewModel reviewModel);
    void deleteReview(long id);
    void deleteAllPizzaReviews(long pizzaId);
    ReviewDTO replaceReview(long id, ReviewModel reviewModel);

    void deleteAllReviews();
}
