package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.model.response.ReviewDTO;
import com.example.Pizzeriabackend.model.request.ReviewRequest;

public interface ReviewService {
    ReviewDTO createReview(ReviewRequest reviewRequest);
    void deleteReview(long id);
    void deleteAllPizzaReviews(long pizzaId);
    ReviewDTO replaceReview(long id, ReviewRequest reviewRequest);

    void deleteAllReviews();
}
