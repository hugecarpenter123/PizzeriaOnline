package com.example.Pizzeriabackend.service;

import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.example.Pizzeriabackend.exception.GeneralNotFoundException;
import com.example.Pizzeriabackend.exception.GeneralServerException;
import com.example.Pizzeriabackend.model.util.StaticAppInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static com.example.Pizzeriabackend.model.util.StaticAppInfo.IMAGE_FOLDER;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageServiceImp implements ImageService {
    @Autowired
    private StaticAppInfo staticAppInfo;
    @Override
    public Resource getImage(String folderName, String imageName) {
        String dir = switch (folderName) {
            case "pizza" -> staticAppInfo.getUploadPizzaImgDir();
            case "drink" -> staticAppInfo.getUploadDrinkImgDir();
            case "user" -> staticAppInfo.getUploadUserImgDir();
            default -> throw new GeneralNotFoundException("Resource folder not found");
        };

        Path imagePath = Paths.get(dir, imageName);
        Resource imageResource = new FileSystemResource(imagePath);
        System.out.println("imagePath: " + imagePath);
        System.out.println("imageResource: " + imageResource);
        if (!imageResource.exists()) throw new GeneralNotFoundException("Image resource doesn't exist");
        return imageResource;
    }

    @Override
    public String saveImage(MultipartFile image, IMAGE_FOLDER imageFolder, String imageName) {
        if (image.isEmpty()) {
            throw new GeneralBadRequestException("Image can not be empty");
        }

        // check content type
        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new GeneralBadRequestException("Invalid format of the image");
        }

        String originalFilename = image.getOriginalFilename();
        String fileNameExtension;
        if (originalFilename == null) {
            throw new GeneralBadRequestException("Image doesn't have file extension");
        } else {
            fileNameExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            if (fileNameExtension.isEmpty()) {
                throw new GeneralBadRequestException("Image doesn't have file extension");
            }
        }

        String imageFileName = imageName.toLowerCase() + fileNameExtension;
        String uploadDirectory = switch (imageFolder) {
            case PIZZA -> staticAppInfo.getUploadPizzaImgDir();
            case DRINK -> staticAppInfo.getUploadDrinkImgDir();
            case USER -> staticAppInfo.getUploadUserImgDir();
        };

        try {
            Path imagePath = Paths.get(uploadDirectory, imageFileName);
            System.out.println("resolved ImagePath is: " + imagePath);

            byte[] bytes = image.getBytes();
            Files.write(imagePath, bytes);
            String folderUrlPath = switch (imageFolder) {
                case PIZZA -> staticAppInfo.getPizzaImgUrlPath();
                case DRINK -> staticAppInfo.getDrinkImgUrlPath();
                case USER -> staticAppInfo.getUserImgUrlPath();
            };

            return folderUrlPath + "/" + imageFileName;

        } catch (IOException e) {
            e.printStackTrace();
            throw new GeneralServerException("Failed to save the image");
        }
    }


    @Override
    public MediaType resolveMediaType(String imageName) {
        String extension = imageName.substring(imageName.lastIndexOf("."));

        return switch (extension) {
            case ".png" -> MediaType.IMAGE_PNG;
            case ".jpg", ".jpeg" -> MediaType.IMAGE_JPEG;
            case ".gif" -> MediaType.IMAGE_GIF;
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}
