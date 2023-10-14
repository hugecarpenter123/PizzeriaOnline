package com.example.Pizzeriabackend.service;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import static com.example.Pizzeriabackend.util.StaticAppInfo.IMAGE_FOLDER;

public interface ImageService {
    MediaType resolveMediaType(String imageName);
    Resource getImage(String folderName, String imageName);
    String saveImage(MultipartFile Image, IMAGE_FOLDER folderName, String imageName);
}
