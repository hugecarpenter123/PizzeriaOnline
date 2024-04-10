package com.example.Pizzeriabackend.model.util;

import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.exception.NoUserPermissionException;
import com.example.Pizzeriabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ServiceUtils {

    @Autowired
    private UserRepository userRepository;

    public User getLoggedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserAuthority = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.USER.name()));
        if (hasUserAuthority) {
            return userRepository.findByEmail(authentication.getName());
        } else {
            throw new NoUserPermissionException("Request denied due to no USER permissions");
        }
    }

    public boolean hasAdminPerms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.ADMIN.name()));
    }

    public boolean hasUserPerms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.USER.name()));
    }

    public boolean hasWorkerPerms() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(Role.WORKER.name()) ||
                        auth.getAuthority().equals(Role.ADMIN.name()));
    }
}
