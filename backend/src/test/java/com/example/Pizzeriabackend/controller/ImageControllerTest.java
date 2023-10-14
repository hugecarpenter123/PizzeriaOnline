package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.config.JWT.service.JwtService;
import com.example.Pizzeriabackend.service.ImageService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ImageController.class)
class ImageControllerTest {

    @MockBean
    private ImageService imageService;

    @MockBean
    private JwtService jwtService;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should return an image with status: 200")
    @WithMockUser(username = "username", roles = "USER")
    void getImage() throws Exception {
        String folderName = "user";
        String imageName = "user_default.jpg";

        byte[] imageBytes = new byte[]{1, 2, 3};
        ByteArrayResource imageResource = new ByteArrayResource(imageBytes);

        when(imageService.getImage(folderName, imageName)).thenReturn(imageResource);
        when(imageService.resolveMediaType(imageName)).thenReturn(MediaType.IMAGE_JPEG);

        mockMvc.perform(MockMvcRequestBuilders.get("/images/{folderName}/{imageName}", folderName, imageName))
                .andExpect(status().isOk());
    }
}