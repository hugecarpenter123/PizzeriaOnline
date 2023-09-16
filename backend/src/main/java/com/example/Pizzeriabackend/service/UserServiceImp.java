package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationRequest;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.entity.*;
import com.example.Pizzeriabackend.exception.DateParsingException;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.InternalAppCode;
import com.example.Pizzeriabackend.model.DTO.OrderDTO;
import com.example.Pizzeriabackend.model.DTO.UserDetailsDTO;
import com.example.Pizzeriabackend.model.UserModel;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.ReviewRepository;
import com.example.Pizzeriabackend.repository.UserRepository;
import com.example.Pizzeriabackend.util.ServiceUtils;
import com.example.Pizzeriabackend.util.StaticAppInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private StaticAppInfo staticAppInfo;
    @Autowired
    private ImageService imageService;

    @Override
    public void registerUser(UserModel userModel) {
        // check for existing email in the db
        if (userRepository.findByEmail(userModel.getEmail()) != null) {
            throw new GeneralBadRequestException("User with given email already exists");
        }

        // TODO: 24.06.2023 here should some validation happen
        if (!validate(userModel)) {
            throw new GeneralBadRequestException("Improper registration data");
        }

        User user = User.builder().name(userModel.getName()).surname(userModel.getSurname()).email(userModel.getEmail()).password(passwordEncoder.encode(userModel.getPassword())).city(userModel.getCity()).cityCode(userModel.getCityCode()).street(userModel.getStreet()).houseNumber(userModel.getHouseNumber()).phoneNumber(userModel.getPhoneNumber()).dateOfBirth(parseDate(userModel.getDateOfBirth())).role(Role.USER).imageUrl(staticAppInfo.getDefaultUserImgUrl()).build();

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
    public void createSuperUser(UserModel userModel) {
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
    public UserDetailsDTO getDetails(Authentication authentication) {
        String email = authentication.getName();

        // this authorities may be helpful in case of introducing ROLE_WORKER
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        User user = userRepository.findByEmail(email);
        return new UserDetailsDTO(user);
    }

    @Override
    public List<OrderDTO> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        return user.getOrders().stream().map(OrderDTO::new).toList();
    }

    @Override
    public void deleteUser() {
        // it throws proper response error if user not found
        User user = ServiceUtils.getLoggedUser(userRepository);
        userRepository.delete(user);
    }

    @Override
    public void saveUserImage(MultipartFile image) {
        System.out.println("saveUserImage service() ------------------------");
        User user = ServiceUtils.getLoggedUser(userRepository);
        String imageName = "user_" + user.getId();

        // ex. output: `http://%s:%s/images/user/user_21.png`
        String imageUrl = imageService.saveImage(image, ServiceUtils.IMAGE_FOLDER.USER, imageName);
        user.setImageUrl(imageUrl);
        userRepository.save(user);
    }

    /**
     *
     * @param userModel
     * Function is meant to update only one field at a time except for group of address fields
     */
    @Override
    public UserDetailsDTO updateUser(UserModel userModel) {
        User user = ServiceUtils.getLoggedUser(userRepository);
        if (userModel.getName() != null && !userModel.getName().isEmpty()) {
            user.setName(userModel.getName());
        }
        else if (userModel.getSurname() != null && !userModel.getSurname().isEmpty()) {
            user.setSurname(userModel.getSurname());
        }
        else if (userModel.getEmail() != null && !userModel.getEmail().isEmpty()) {
            user.setEmail(userModel.getEmail());
        }
        else if (userModel.getOldPassword() != null && userModel.getPassword() != null) {
//            if (!authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), userModel.getOldPassword())).isAuthenticated()) {
//                throw new GeneralBadRequestException("Provided old password is not correct", InternalAppCode.BAD_OLD_PASSWORD);
//            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), userModel.getOldPassword()));
            user.setPassword(passwordEncoder.encode(userModel.getPassword()));
        }
        else if (userModel.getPhoneNumber() != null && !userModel.getPhoneNumber().isEmpty()) {
            user.setPhoneNumber(userModel.getPhoneNumber());
        }
        else if (
                userModel.getCity() != null && !userModel.getCity().isEmpty() &&
                userModel.getCityCode() != null && !userModel.getCityCode().isEmpty() &&
                userModel.getStreet() != null && !userModel.getStreet().isEmpty() &&
                userModel.getHouseNumber() != null && !userModel.getHouseNumber().isEmpty()
        ) {
            user.setCity(userModel.getCity());
            user.setCityCode(userModel.getCityCode());
            user.setStreet(userModel.getStreet());
            user.setHouseNumber(userModel.getHouseNumber());
        }

        return new UserDetailsDTO(userRepository.save(user));
    }

    private boolean validate(UserModel userModel) {
        return true;
    }

}
