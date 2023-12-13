package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.entity.Review;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.model.response.ReviewDTO;
import com.example.Pizzeriabackend.model.request.ReviewRequest;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.ReviewRepository;
import com.example.Pizzeriabackend.repository.UserRepository;
import com.example.Pizzeriabackend.util.ServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImp implements ReviewService {
    @Autowired
    private PizzaRepository pizzaRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ServiceUtils serviceUtils;

    @Override
    public ReviewDTO createReview(ReviewRequest reviewRequest) {
        boolean isReviewModelOk = (reviewRequest.getPizzaId() > 0)
                && ((reviewRequest.getStars() >= 0 && reviewRequest.getStars() <= 5) ||
                (reviewRequest.getContent() != null && !reviewRequest.getContent().isEmpty()));

        if (!isReviewModelOk) throw new GeneralBadRequestException("Review model filled improperly");
        Pizza pizza =  pizzaRepository.findById(reviewRequest.getPizzaId()).orElseThrow(() ->
                new GeneralNotFoundException("Pizza not found"));

        User user = serviceUtils.getLoggedUser();

        Review review = Review.builder()
                .pizza(pizza)
                .user(user)
                .stars(reviewRequest.getStars())
                .content(reviewRequest.getContent())
                .build();

        reviewRepository.save(review);
        return new ReviewDTO(review, user);
    }

    @Override
    public void deleteReview(long id) {
        if (serviceUtils.hasAdminPerms()) {
            reviewRepository.deleteById(id);
        }
        else if (serviceUtils.hasUserPerms()) {
            Review review = reviewRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Review not found"));
            User reviewUser = review.getUser();
            User requestUser = serviceUtils.getLoggedUser();
            if (!requestUser.getId().equals(reviewUser.getId())) {
                throw new AccessDeniedException("User is not authorized to perform action on this resource");
            }
            reviewRepository.deleteById(id);
        }
    }

    @Override
    public void deleteAllPizzaReviews(long pizzaId) {
        Pizza pizza = pizzaRepository.findById(pizzaId).orElseThrow(() -> new GeneralNotFoundException("Pizza with given id not found"));
        List<Review> reviews = pizza.getReviews();
        reviews.forEach(review -> reviewRepository.delete(review));
        reviews.clear();
    }

    @Override
    public ReviewDTO replaceReview(long id, ReviewRequest reviewRequest) {
        User user = serviceUtils.getLoggedUser();
        Review review = reviewRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Review not found"));
        if (user != review.getUser()) {
            throw new NoUserPermissionException("Requester is not authorized to perform this operation");
        }
        Pizza pizza = review.getPizza();
        reviewRepository.delete(review);

        Review newReview = Review.builder()
                .content(reviewRequest.getContent())
                .stars(reviewRequest.getStars())
                .pizza(pizza)
                .user(user)
                .build();

        reviewRepository.save(newReview);
        return new ReviewDTO(newReview, user);
    }

    @Override
    public void deleteAllReviews() {
        reviewRepository.deleteAll();
    }
}
