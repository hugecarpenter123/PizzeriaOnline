package com.example.Pizzeriabackend.config.JWT;

import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthFilter.class);
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(AUTHORIZATION);
        final String jwt;
        final String userEmail;

        // if authentication header is empty or doesn't contain jwt token, proceed the filtering and return
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        // this try/catch block is to handle JWT errors
        try {
            userEmail = jwtService.extractUsername(jwt);

            // user is not connected yet (token contain userEmail but no authentication in the context)
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // retrieve user by email from db, if not existing throw error
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                System.out.println("JWT filter-----------------------");
                System.out.println("userDetails.getUsername: " + userDetails.getUsername());
                System.out.println("userDetails.getAuthorities(): " + userDetails.getAuthorities());

                // check if token is valid
                if (jwtService.isTokenValid(jwt)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    // set additional request details
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // update security context holder
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            // after all request updates, call subsequent filters
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}
