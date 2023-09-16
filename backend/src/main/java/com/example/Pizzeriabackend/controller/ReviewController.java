package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.model.DTO.ReviewDTO;
import com.example.Pizzeriabackend.model.ReviewModel;
import com.example.Pizzeriabackend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("-pizza/{id}")
    public ResponseEntity<Void> deletePizzaReviews(@PathVariable("id") long pizzaId) {
        reviewService.deleteAllPizzaReviews(pizzaId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, ReviewDTO>> createReview(@RequestBody ReviewModel reviewModel) {
        ReviewDTO review = reviewService.createReview(reviewModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", review));
    }

    /**
     * Method is the combination of DELETE and POST requests. Instead of updating the review, it deletes one and
     * creates new review to the same pizza which former review was assigned to. Passing pizzaId is of no consequence, it
     * is always going to be assigned to the same previous review's pizza.
     *
     * @param id path variable of the review id
     * @param reviewModel convertible to Java object JSON request body
     * @return Map of "result" String key and ReviewDto object
     */
    @PutMapping("/replace/{id}")
    public ResponseEntity<Map<String, ReviewDTO>> replaceReview(@PathVariable("id") long id, @RequestBody ReviewModel reviewModel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("result", reviewService.replaceReview(id, reviewModel))
        );
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<Void> deleteAllReviews() {
        reviewService.deleteAllReviews();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
