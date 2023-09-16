package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.entity.Pizza;
import com.example.Pizzeriabackend.entity.Review;
import com.example.Pizzeriabackend.entity.Role;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.model.DTO.ReviewDTO;
import com.example.Pizzeriabackend.model.ReviewModel;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.ReviewRepository;
import com.example.Pizzeriabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Override
    public ReviewDTO createReview(ReviewModel reviewModel) {
        // grab user from the authentication, check if has necessary auths
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserAuthority = hasUserAuthority(authentication);

        boolean isReviewModelOk = (hasUserAuthority && reviewModel.getPizzaId() > 0)
                && ((reviewModel.getStars() >= 0 && reviewModel.getStars() <= 5) ||
                (reviewModel.getContent() != null && !reviewModel.getContent().isEmpty()));

        if (!isReviewModelOk) throw new GeneralBadRequestException("Review model filled improperly");
        Pizza pizza =  pizzaRepository.findById(reviewModel.getPizzaId()).orElseThrow(() ->
                new GeneralNotFoundException("Pizza not found"));

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Review review = Review.builder()
                .pizza(pizza)
                .user(user)
                .stars(reviewModel.getStars())
                .content(reviewModel.getContent())
                .build();

        review = reviewRepository.save(review);
        return new ReviewDTO(review, user);
    }

    @Override
    public void deleteReview(long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (hasAdminAuthority(authentication)) {
            reviewRepository.deleteById(id);
        }
        else if (hasUserAuthority(authentication)) {
            Review review = reviewRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Review not found"));
            User reviewUser = review.getUser();
            User requestUser = (User) authentication.getPrincipal();
            if (!requestUser.getId().equals(reviewUser.getId())) {
                throw new NoUserPermissionException("Requester is not authorised to perform operation on the given resource");
            }
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
    public ReviewDTO replaceReview(long id, ReviewModel reviewModel) {
        User user = getLoggedUser();
        Review review = reviewRepository.findById(id).orElseThrow(() -> new GeneralNotFoundException("Review not found"));

        // this check is necessary because it's not enough to have USER perms, given review must also belong to the same requester
        if (user != review.getUser()) {
            throw new NoUserPermissionException("Requester is not authorized to perform this operation");
        }
        Pizza pizza = review.getPizza();
        reviewRepository.delete(review);

        Review newReview = Review.builder()
                .content(reviewModel.getContent())
                .stars(reviewModel.getStars())
                .pizza(pizza)
                .user(user)
                .build();

        newReview = reviewRepository.save(newReview);
        // TODO: 29.06.2023 probably unnecessary lines below
//        pizza.getReviews().add(newReview);
//        user.getReviews().add(newReview);

        // not entirely necessary for the app
        return new ReviewDTO(newReview, user);
    }

    @Override
    public void deleteAllReviews() {
        if(hasAdminAuthority(SecurityContextHolder.createEmptyContext().getAuthentication())) {
            reviewRepository.deleteAll();
        } else {
            // TODO: 29.06.2023 maybe custom NoAdminPermissionException instead of this
            throw new NoUserPermissionException("Access denied, admin authority required for this operation");
        }
    }

    private User getLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserAuthority = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.USER.name()));
        if (hasUserAuthority) {
            return userRepository.findByEmail(authentication.getName());
        } else {
            throw new NoUserPermissionException("Request denied due to no USER permissions");
        }
    }

    private boolean hasUserAuthority(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.USER.name()));
    }

    private boolean hasAdminAuthority(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.ADMIN.name()));
    }
}
