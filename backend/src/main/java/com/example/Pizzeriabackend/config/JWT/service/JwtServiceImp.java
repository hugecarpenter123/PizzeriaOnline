package com.example.Pizzeriabackend.config.JWT.service;

import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.config.JWT.model.RefreshTokenRequest;
import com.example.Pizzeriabackend.entity.RefreshToken;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.exception.InternalAppCode;
import com.example.Pizzeriabackend.exception.RefreshTokenException;
import com.example.Pizzeriabackend.repository.RefreshTokenRepository;
import com.example.Pizzeriabackend.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtServiceImp implements JwtService {
    private static final Logger logger = LoggerFactory.getLogger(JwtServiceImp.class);
    private static final String SECRET_KEY = "4A404D635166546A576E5A7234753778214125442A472D4B6150645267556B58";
    private static final Long REFRESH_TOKEN_EXPIRY_DATE = 1000 * 60 * 60 * 24L;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    private Claims extractAllClaims(String token) {
        // returns body of a token
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public <T> T extractClaims(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // generating jwt token without extra claims
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public boolean isTokenValid(String token) {
        // TODO: 24.06.2023 removal of potential redundant "extractUsername" double call
        logger.info("isTokenValid(): " + !isTokenExpired(token));
        return !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

    // for refresh token -------------------------------------------
    @Transactional
    public RefreshToken generateRefreshToken(User user) {
        System.out.println("generateRefreshToken()--------------------------");
        // get rid of old refreshTokens
        refreshTokenRepository.deleteAllByUser(user);
        refreshTokenRepository.flush();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .expirationDate(Instant.now().plusMillis(REFRESH_TOKEN_EXPIRY_DATE))
                .user(user)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest requestModel) {
        System.out.println("JwtService.refreshToken()------------");
        String token = requestModel.getToken();
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RefreshTokenException("Refresh token doesn't exist", InternalAppCode.BAD_REFRESH_TOKEN));

        if (refreshToken.getExpirationDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(refreshToken);
            throw new RefreshTokenException("Refresh token has expired", InternalAppCode.REFRESH_TOKEN_EXPIRED);
        }

        return AuthenticationResponse.builder()
                .token(this.generateToken(refreshToken.getUser()))
                .refreshToken(refreshToken.getToken())
                .build();
    }

//    public AuthenticationResponse refreshToken(RefreshTokenRequest requestModel) {
//        System.out.println("JwtService.refreshToken()------------");
//
//        try {
//            String token = requestModel.getToken();
//            // Add logging to print the received token
//            System.out.println("Received Token: " + token);
//
//            RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
//                    .orElseThrow(() -> new AccessDeniedException("Refresh token doesn't exist"));
//
//            if (refreshToken.getExpirationDate().compareTo(Instant.now()) < 0) {
//                refreshTokenRepository.delete(refreshToken);
//                throw new AccessDeniedException("Refresh token has expired");
//            }
//
//            return AuthenticationResponse.builder()
//                    .token(this.generateToken(refreshToken.getUser()))
//                    .refreshToken(refreshToken.getToken())
//                    .build();
//        } catch (Exception e) {
//            System.err.println("Exception during refreshToken: " + e.getMessage());
//            // Log any exceptions that occur during processing
//            throw e; // Rethrow the exception for further investigation
//        }
//    }
}
