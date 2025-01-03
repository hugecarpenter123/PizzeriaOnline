package com.example.Pizzeriabackend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import com.example.Pizzeriabackend.config.JWT.model.AuthenticationRequest;
import com.example.Pizzeriabackend.config.JWT.model.AuthenticationResponse;
import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.entity.RefreshToken;
import com.example.Pizzeriabackend.entity.User;
import com.example.Pizzeriabackend.entity.enums.Role;
import com.example.Pizzeriabackend.model.request.CreateSuperuserRequest;
import com.example.Pizzeriabackend.model.response.OrderDTO;
import com.example.Pizzeriabackend.model.response.UserDetailsDTO;
import com.example.Pizzeriabackend.model.util.ServiceUtils;
import com.example.Pizzeriabackend.model.util.StaticAppInfo;
import com.example.Pizzeriabackend.repository.PizzaRepository;
import com.example.Pizzeriabackend.repository.RefreshTokenRepository;
import com.example.Pizzeriabackend.repository.ReviewRepository;
import com.example.Pizzeriabackend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PizzaRepository pizzaRepository;
    @Mock
    private ReviewRepository reviewRepository;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private OrderService orderService;
    @Mock
    private JwtService jwtService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private StaticAppInfo staticAppInfo;
    @Mock
    private ImageService imageService;
    @Mock
    private ServiceUtils serviceUtils;
    @Mock
    private ApplicationEventPublisher eventPublisher;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private UserServiceImp userService;

    private User mockedUser;
    private List<Order> mockedUserOrders;

    @BeforeEach
    public void setUp() {
        mockedUser = User.builder()
                .id(1L)
                .email("mockedUser@example.com")
                .build();

        mockedUserOrders = List.of(
                Order.builder()
                        .id(1L)
                        .orderedDrinks(Collections.emptyList())
                        .orderedPizzas(Collections.emptyList())
                        .user(mockedUser)
                        .build()
        );

        mockedUser.setOrders(mockedUserOrders);
        MockitoAnnotations.openMocks(UserServiceTest.class);
    }

    @Test
    void should_RegisterUser_WhenValidDataProvided() {

    }

    @Test
    void should_CreateSuperUser_WhenValidRequestProvided() {
        CreateSuperuserRequest mockRequest = new CreateSuperuserRequest();
        mockRequest.setEmail("admin@example.com");
        mockRequest.setName("Admin");
        mockRequest.setSurname("AdminSurname");
        mockRequest.setPassword("adminPassword");

        userService.createSuperUser(mockRequest);

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void should_ReturnAuthenticationResponse_WhenLoginSuccessful() {
        String userEmail = "test@example.com";
        String userPassword = "password123";
        String encodedPassword = "encodedPassword";
        String generatedAccessToken = "token";
        String generatedRefreshToken = "mockRefreshToken";
        Long userId = 1L;

        User mockUser = User.builder()
                .id(userId)
                .email(userEmail)
                .password(encodedPassword)
                .role(Role.USER)
                .build();

        AuthenticationRequest authenticationRequest = new AuthenticationRequest(userEmail, userPassword);

        when(userRepository.findByEmail(userEmail)).thenReturn(mockUser);

        RefreshToken mockRefreshToken = RefreshToken.builder()
                .id(1L)
                .token(generatedRefreshToken)
                .user(mockUser)
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(mockUser, null, null));

        when(jwtService.generateRefreshToken(mockUser)).thenReturn(mockRefreshToken);
        when(jwtService.generateToken(mockUser)).thenReturn(generatedAccessToken);

        AuthenticationResponse authenticationResponse = userService.loginUser(authenticationRequest);

        assertNotNull(authenticationResponse);
        assertEquals(userEmail, authenticationResponse.getUserDetails().getEmail());
        assertNotNull(authenticationResponse.getToken());
        assertNotNull(authenticationResponse.getRefreshToken());
        assertEquals(mockRefreshToken.getToken(), authenticationResponse.getRefreshToken());
        assertEquals(generatedAccessToken, authenticationResponse.getToken());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void should_ReturnUserDetails_WhenGettingMyDetails() {
        when(serviceUtils.getLoggedUser()).thenReturn(mockedUser);
        UserDetailsDTO response = userService.getMyDetails();

        assertNotNull(response);
        assertEquals(mockedUser.getId(), response.getId());
    }

    @Test
    void should_ReturnOrdersList_WhenGettingUserOrders() {
        when(userRepository.findById(mockedUser.getId())).thenReturn(Optional.ofNullable(mockedUser));

        List<OrderDTO> orderDtoList = userService.getUserOrders(mockedUser.getId());

        assertNotNull(orderDtoList);
        assertEquals(1, orderDtoList.size());
        assertEquals(mockedUserOrders.get(0).getId(), orderDtoList.get(0).getOrderId());
    }

    @Test
    void should_DeleteUserAndRelatedData_WhenDeletingUser() {
        // given
        when(serviceUtils.getLoggedUser()).thenReturn(mockedUser);

        // when
        userService.deleteUser();

        // then
        verify(refreshTokenRepository).deleteAllByUser(mockedUser);
        verify(userRepository).delete(mockedUser);
    }

    @Test
    void should_SaveUserImage_WhenValidImageProvided() {
        // given
        String userEmail = "test@example.com";
        Long userId = 1L;
        User mockUser = User.builder()
                .id(userId)
                .email(userEmail)
                .build();

        MockMultipartFile mockMultipartFile = new MockMultipartFile(
                "image.png",
                "test.png",
                "image/png",
                "Spring Framework".getBytes()
        );

        when(serviceUtils.getLoggedUser()).thenReturn(mockUser);
        when(imageService.saveImage(any(MultipartFile.class), any(StaticAppInfo.IMAGE_FOLDER.class), any(String.class)))
                .thenReturn("http://localhost:8080/images/user/user_1.png");

        // when
        userService.saveUserImage(mockMultipartFile);

        // then
        verify(userRepository).save(mockUser);
    }
}