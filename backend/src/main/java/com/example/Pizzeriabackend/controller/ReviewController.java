package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.model.request.ReviewRequest;
import com.example.Pizzeriabackend.model.response.ReviewDTO;
import com.example.Pizzeriabackend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PostMapping
    public ResponseEntity<Map<String, ReviewDTO>> createReview(@RequestBody ReviewRequest reviewRequest) {
        ReviewDTO review = reviewService.createReview(reviewRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("result", review));
    }

    /**
     * Method is the combination of DELETE and POST requests. Instead of updating the review, it deletes one and
     * creates new review to the same pizza which former review was assigned to. Passing pizzaId is of no consequence, it
     * is always going to be assigned to the same previous review's pizza.
     *
     * @param id path variable of the review id
     */
    @PutMapping("/replace/{id}")
    public ResponseEntity<Map<String, ReviewDTO>> replaceReview(@PathVariable("id") long id, @RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("result", reviewService.replaceReview(id, reviewRequest))
        );
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping
    public ResponseEntity<Void> deleteAllReviews() {
        reviewService.deleteAllReviews();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/pizza/{pizzaId}")
    public ResponseEntity<Void> deletePizzaReviews(@PathVariable("pizzaId") long pizzaId) {
        reviewService.deleteAllPizzaReviews(pizzaId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
