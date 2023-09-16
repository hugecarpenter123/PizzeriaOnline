package com.example.Pizzeriabackend.config;

import com.example.Pizzeriabackend.config.JWT.JwtAuthFilter;
import com.example.Pizzeriabackend.entity.Role;
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

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final List<String> WHITE_LIST = List.of(
            "/api/order/create",
            "/api/menu",
            "/api/pizza(/\\d+)?",
            "/api/drink(/\\d+)?",
            "/api/user/register",
            "/api/user/getToken"
    );
    public static final String WHITE_LIST_REGEX = "/api/(menu(/pizza(/\\d+)?|/drink(/\\d+)?)?|order/create|user/(register|getToken))$";
    public static final String WHITE_LIST_REGEX_debug = "/(api/(menu(/pizza-less(/\\d+)?|/drink(/\\d+)?)?|order/create|user/(register|getToken|createSuperUser|refreshToken))|images/(pizza|drink|user)/.+)$";
    public static final String ADMIN_PERMS_REGEX = "/api/(menu/(pizza/(create|delete/\\d+)|drink/(create|delete/\\d+))|order(/create|/delete/\\d+|/update/\\d+)?)$";
    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(AbstractHttpConfigurer::disable);
        http.authorizeHttpRequests(request -> request
                .requestMatchers(RegexRequestMatcher.regexMatcher(WHITE_LIST_REGEX_debug)).permitAll()
                .requestMatchers(RegexRequestMatcher.regexMatcher(ADMIN_PERMS_REGEX)).hasAuthority(Role.ADMIN.name())
                .anyRequest().authenticated());
//        http.authorizeHttpRequests(request -> request.anyRequest().permitAll());

        http.authenticationProvider(authenticationProvider);
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
