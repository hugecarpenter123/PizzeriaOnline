package com.example.Pizzeriabackend.util;

import com.example.Pizzeriabackend.entity.Role;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class ServiceUtils {
    public static User getLoggedUser(UserRepository userRepository) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserAuthority = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.USER.name()));
        if (hasUserAuthority) {
            return userRepository.findByEmail(authentication.getName());
        } else {
            throw new NoUserPermissionException("Request denied due to no USER permissions");
        }
    }

    public static boolean hasAdminPerms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.ADMIN.name()));
    }

    public static boolean hasUserPerms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.USER.name()));
    }

    public enum IMAGE_FOLDER {
        PIZZA,
        DRINK,
        USER
    }
}
