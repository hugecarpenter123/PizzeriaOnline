package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.RefreshToken;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
//@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
//@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
//@ActiveProfiles("test")
class RefreshTokenRepositoryTest {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private RefreshToken refreshToken;
    private static final String TOKEN_VALUE = "exampleRefreshToken";

    @BeforeEach
    public void setUp() {
        user = User.builder()
                .email("user@gmail.com")
                .password("password")
                .role(Role.USER)
                .build();

        refreshToken = RefreshToken.builder()
                .token(TOKEN_VALUE)
                .expirationDate(Instant.now())
                .user(user)
                .build();

        userRepository.save(user);
        refreshTokenRepository.save(refreshToken);
    }


    @Test
    @DisplayName("Should find the RefreshToken by token value")
    void findByToken_ShouldReturnToken() {
        assertNotNull(userRepository.findByEmail("user@gmail.com"));
        assertNotNull(user.getId());

        Optional<RefreshToken> retrievedRefreshToken = refreshTokenRepository.findByToken(TOKEN_VALUE);

        assertThat(retrievedRefreshToken).isPresent();
        assertThat(retrievedRefreshToken.get().getId()).isEqualTo(refreshToken.getId());
        assertThat(retrievedRefreshToken.get().getUser().getId()).isEqualTo(user.getId());

    }

    @Test
    @DisplayName("Should delete all refresh tokens assigned to user")
    void deleteAllByUser_ShouldDeleteRefreshTokens() {
        Optional<RefreshToken> savedToken = refreshTokenRepository.findByToken(TOKEN_VALUE);
        assertThat(savedToken).isPresent();

        refreshTokenRepository.deleteAllByUser(user);

        Optional<RefreshToken> deletedToken = refreshTokenRepository.findByToken(TOKEN_VALUE);
        assertThat(deletedToken).isEmpty();
    }
}