package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationRequest;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.entity.*;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.exception.DateParsingException;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.model.response.UserDetailsDTO;
import com.example.Pizzeriabackend.model.request.CreateSuperuserRequest;
import com.example.Pizzeriabackend.model.request.UserDetailsRequest;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.ReviewRepository;
import com.example.Pizzeriabackend.repository.UserRepository;
import com.example.Pizzeriabackend.util.ServiceUtils;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Collection;
import java.util.List;

@Service
@Slf4j
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PizzaRepository pizzaRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private OrderService orderService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private StaticAppInfo staticAppInfo;
    @Autowired
    private ImageService imageService;
    @Autowired
    private ServiceUtils serviceUtils;

    @Override
    public void registerUser(UserDetailsRequest userDetailsRequest) {
        // check for existing email in the db
        if (userRepository.findByEmail(userDetailsRequest.getEmail()) != null) {
            throw new GeneralBadRequestException("User with given email already exists");
        }

        // TODO: 24.06.2023 here should some validation happen
        if (!validate(userDetailsRequest)) {
            throw new GeneralBadRequestException("Improper registration data");
        }

        User user = User.builder()
                .name(userDetailsRequest.getName())
                .surname(userDetailsRequest.getSurname())
                .email(userDetailsRequest.getEmail())
                .password(passwordEncoder.encode(userDetailsRequest.getPassword()))
                .city(userDetailsRequest.getCity())
                .cityCode(userDetailsRequest.getCityCode())
                .street(userDetailsRequest.getStreet())
                .houseNumber(userDetailsRequest.getHouseNumber())
                .phoneNumber(userDetailsRequest.getPhoneNumber())
                .dateOfBirth(parseDate(userDetailsRequest.getDateOfBirth()))
                .role(Role.USER)
                .imageUrl(staticAppInfo.getDefaultUserImgUrl()).build();

        userRepository.save(user);
    }

    /**
     * @param stringDate string representation of potential LocalDate object
     * @return LocalDate object or throws error with explanation
     */
    private LocalDate parseDate(String stringDate) {
        try {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return LocalDate.parse(stringDate, dateFormatter);
        } catch (DateTimeParseException e) {
            throw new DateParsingException("Improper `dateOfBirth` value, format should be: `dd-MM-yyyy`");
        }
    }

    @Override
    public void createSuperUser(CreateSuperuserRequest userModel) {
        userRepository.save(User.builder().email(userModel.getEmail()).name(userModel.getName()).surname(userModel.getSurname()).password(passwordEncoder.encode(userModel.getPassword())).role(Role.ADMIN).build());
    }

    @Override
    public AuthenticationResponse loginUser(AuthenticationRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        User user = userRepository.findByEmail(email);
        String jwtToken = jwtService.generateToken(user);

        RefreshToken refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder().token(jwtToken).refreshToken(refreshToken.getToken()).userDetails(new UserDetailsDTO(user)).build();
    }

    @Override
    public UserDetailsDTO getDetails() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // this authorities may be helpful in case of introducing ROLE_WORKER
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();
        User user = userRepository.findByEmail(email);
        return new UserDetailsDTO(user);
    }

    @Override
    public List<OrderDTO> getUserOrders() {
        return orderService.getMyOrders();
    }

    @Override
    public void deleteUser() {
        // it throws proper response error if user not found
        User user = serviceUtils.getLoggedUser();
        userRepository.delete(user);
    }

    @Override
    public void saveUserImage(MultipartFile image) {
        User user = serviceUtils.getLoggedUser();
        String imageName = "user_" + user.getId();

        // ex. output: `http://%s:%s/images/user/user_21.png`
        String imageUrl = imageService.saveImage(image, StaticAppInfo.IMAGE_FOLDER.USER, imageName);
        user.setImageUrl(imageUrl);
        userRepository.save(user);
    }

    /**
     * @param userDetailsRequest Function is meant to update only one field at a time except for group of address fields
     */
    @Override
    public UserDetailsDTO updateUser(UserDetailsRequest userDetailsRequest) {
        User user = serviceUtils.getLoggedUser();
        if (userDetailsRequest.getName() != null && !userDetailsRequest.getName().isEmpty()) {
            user.setName(userDetailsRequest.getName());
        } else if (userDetailsRequest.getSurname() != null && !userDetailsRequest.getSurname().isEmpty()) {
            user.setSurname(userDetailsRequest.getSurname());
        } else if (userDetailsRequest.getEmail() != null && !userDetailsRequest.getEmail().isEmpty()) {
            user.setEmail(userDetailsRequest.getEmail());
        } else if (userDetailsRequest.getOldPassword() != null && userDetailsRequest.getPassword() != null) {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), userDetailsRequest.getOldPassword()));
            user.setPassword(passwordEncoder.encode(userDetailsRequest.getPassword()));
        } else if (userDetailsRequest.getPhoneNumber() != null && !userDetailsRequest.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(userDetailsRequest.getPhoneNumber());
        } else if (
                userDetailsRequest.getCity() != null && !userDetailsRequest.getCity().isEmpty() &&
                        userDetailsRequest.getCityCode() != null && !userDetailsRequest.getCityCode().isEmpty() &&
                        userDetailsRequest.getStreet() != null && !userDetailsRequest.getStreet().isEmpty() &&
                        userDetailsRequest.getHouseNumber() != null && !userDetailsRequest.getHouseNumber().isEmpty()
        ) {
            user.setCity(userDetailsRequest.getCity());
            user.setCityCode(userDetailsRequest.getCityCode());
            user.setStreet(userDetailsRequest.getStreet());
            user.setHouseNumber(userDetailsRequest.getHouseNumber());
        }

        return new UserDetailsDTO(userRepository.save(user));
    }

    private boolean validate(UserDetailsRequest userDetailsRequest) {
        return true;
    }

}
