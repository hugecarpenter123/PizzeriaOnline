package com.example.Pizzeriabackend.config;

import com.example.Pizzeriabackend.config.JWT.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    //    public static final String WHITE_LIST_REGEX = "/(swagger.*)|/api/(menu|pizza(/\\d+)?|drink(/\\d+)?|order|user/(register|login|refreshToken|send-email))|/images/(pizza|drink|user)/.+|/css/.+$";
    public static final String WHITE_LIST_REGEX = "/(swagger.*)|/api/(ingredient|menu|pizza(/\\d+)?|drink(/\\d+)?|order|user/(register|login|refreshToken|send-email))|/images/(pizza|drink|user)/.+|/css/.+$";
    public static final String SWAGGER_REGEX = "/api/v1/auth/.*|/v2/api-docs|/v3/api-docs|/v3/api-docs/.*|/swagger-resources|/swagger-resources/.*|/configuration/ui|/configuration/security|/swagger-ui/.*|/webjars/.*|/swagger-ui.html";

    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(request -> request
                .requestMatchers(RegexRequestMatcher.regexMatcher(WHITE_LIST_REGEX)).permitAll()
                .requestMatchers(RegexRequestMatcher.regexMatcher(SWAGGER_REGEX)).permitAll()
                .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider);
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
