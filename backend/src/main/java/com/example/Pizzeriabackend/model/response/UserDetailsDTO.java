package com.example.Pizzeriabackend.model.response;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.entity.Review;
import com.example.Pizzeriabackend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetailsDTO {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String city;
    private String cityCode;
    private String street;
    private String houseNumber;
    private String phoneNumber;
    private String imageUrl;
    private LocalDate dateOfBirth;
    private List<OrderDTO> orders;
    private List<UserReviewDTO> reviews;

    public UserDetailsDTO(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.email = user.getEmail();
        this.city = user.getCity();
        this.cityCode = user.getCityCode();
        this.street = user.getStreet();
        this.houseNumber = user.getHouseNumber();
        this.phoneNumber = user.getPhoneNumber();
        this.dateOfBirth = user.getDateOfBirth();
        this.imageUrl = user.getImageUrl();
        this.reviews = getUserReviewDtoList(user.getReviews());
    }

    private List<UserReviewDTO> getUserReviewDtoList(List<Review> reviews) {
        return reviews != null ? reviews.stream().map(UserReviewDTO::new).toList() : Collections.emptyList();
    }

    private List<OrderDTO> getOrderDtoList(List<Order> orders) {
        return orders.stream().map(OrderDTO::new).toList();
    }
}
