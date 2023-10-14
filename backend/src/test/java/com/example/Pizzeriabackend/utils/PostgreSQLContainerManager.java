package com.example.Pizzeriabackend.utils;

import org.testcontainers.containers.PostgreSQLContainer;

public class PostgreSQLContainerManager {

    private static final PostgreSQLContainer<?> postgresContainer;

    static {
        postgresContainer = new PostgreSQLContainer<>("postgres:latest")
                .withDatabaseName("testDb")
                .withUsername("testUser")
                .withPassword("pass");
        postgresContainer.start();
    }

    public static PostgreSQLContainer<?> getContainer() {
        return postgresContainer;
    }

    public static void stopContainer() {
        if (postgresContainer != null && postgresContainer.isRunning()) {
            postgresContainer.stop();
        }
    }
}