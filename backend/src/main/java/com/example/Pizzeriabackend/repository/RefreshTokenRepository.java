package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.RefreshToken;
import com.example.Pizzeriabackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteAllByUser(User user);
}
