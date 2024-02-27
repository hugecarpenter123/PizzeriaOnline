package com.example.Pizzeriabackend.config;

import com.example.Pizzeriabackend.entity.AppInfo;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.exception.InternalAppCode;
import com.example.Pizzeriabackend.repository.AppInfoRepository;
import com.example.Pizzeriabackend.repository.DrinkRepository;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.UserRepository;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;


@Configuration
@EnableWebSecurity
public class AppConfig {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            User user = userRepository.findByEmail(username);
            if (user == null) throw new GeneralNotFoundException("User not found", InternalAppCode.RESOURCE_NOT_FOUND);
            return userRepository.findByEmail(username);
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CommandLineRunner commandLineRunner(PizzaRepository pizzaRepository,
                                               DrinkRepository drinkRepository,
                                               UserRepository userRepository,
                                               StaticAppInfo staticAppInfo,
                                               AppInfoRepository appInfoRepository) {
        return args -> {
            // sprawdzenie czy host zapisany w bazie danych, jest zgodny z application.yml
            // jeżeli nie, zamień imgUrl we wszystkich miejscach, które z niego korzystają
            String applicationHost = staticAppInfo.getApplicationHost();
            Optional<AppInfo> appInfoEntity = appInfoRepository.findById(1L);
            String persistedHost = appInfoEntity.map(AppInfo::getHost).orElse("");

            if (persistedHost.equals(applicationHost)) return;
            else if (persistedHost.equals("")) {
                AppInfo appInfo = new AppInfo();
                appInfo.setHost(applicationHost);
                appInfoRepository.save(appInfo);
            }

            userRepository.findAll().forEach(user -> {
                String imageUrl = user.getImageUrl();
                if (imageUrl != null) {
                    String imageName = imageUrl.substring(imageUrl.lastIndexOf("/"));
                    user.setImageUrl(staticAppInfo.getUserImgUrlPath() + imageName);
                }
            });

            pizzaRepository.findAll().forEach(pizza -> {
                String imageUrl = pizza.getImageUrl();
                String imageName = imageUrl.substring(imageUrl.lastIndexOf("/"));
                pizza.setImageUrl(staticAppInfo.getPizzaImgUrlPath() + imageName);
                pizzaRepository.save(pizza);
            });

            drinkRepository.findAll().forEach(drink -> {
                String imageUrl = drink.getImageUrl();
                String imageName = imageUrl.substring(imageUrl.lastIndexOf("/"));
                drink.setImageUrl(staticAppInfo.getDrinkImgUrlPath() + imageName);
                drinkRepository.save(drink);
            });
        };
    }

}
