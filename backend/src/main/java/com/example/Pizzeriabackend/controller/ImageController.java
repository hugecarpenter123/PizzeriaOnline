package com.example.Pizzeriabackend.controller;

import com.example.Pizzeriabackend.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @GetMapping(value = "/{folderName}/{imageName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String folderName, @PathVariable String imageName) {

        Resource imageResource = imageService.getImage(folderName, imageName);
        MediaType mediaType = imageService.resolveMediaType(imageName);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(imageResource);
    }
}
