package com.example.Pizzeriabackend.model.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StaticAppInfo {
    public enum IMAGE_TYPE {
        PIZZA,
        DRINK,
        USER,
    }
    public enum IMAGE_FOLDER {
        PIZZA,
        DRINK,
        USER
    }
    @Value("${server.address}")
    private String serverAddress;

    @Value("${server.port}")
    private String serverPort;

    @Value("${image-upload-folder}")
    private String imageRootFolder;

    public String getApplicationHost() {
        return serverAddress + ":" + serverPort;
    }

    // URLS that trigger controller response -------------------------
    public String getPizzaImgUrlPath() {
        return String.format("http://%s:%s/images/pizza",
                serverAddress,
                serverPort);
    }

    public String getDrinkImgUrlPath() {
        return String.format("http://%s:%s/images/drink",
                serverAddress,
                serverPort);
    }

    public String getUserImgUrlPath() {
        return String.format("http://%s:%s/images/user",
                serverAddress,
                serverPort);
    }
    // END URLS that trigger controller response ---------------------

    // PATHS to specific resource folders ----------------------------
    public String getUploadPizzaImgDir() {
        return imageRootFolder + "\\pizza";
    }
    public String getUploadDrinkImgDir() {
        return imageRootFolder + "\\drink";
    }
    public String getUploadUserImgDir() {
        return imageRootFolder + "\\user";
    }
    // END PATHS to specific resource folders ------------------------

    public String getDefaultPizzaImgUrl() {
        return getPizzaImgUrlPath() + "/pizza-default.jpg";
    }
    public String getDefaultDrinkImgUrl() {
        return getDrinkImgUrlPath() + "/drink-default.jpg";
    }
    public String getDefaultUserImgUrl() {
        return getUserImgUrlPath() + "/user-default.png";
    }
}
