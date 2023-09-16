package com.example.Pizzeriabackend.entity;

public enum DrinkSizes {
    SMALL_330("Small (330ml)"),
    MEDIUM_500("Medium (500ml)"),
    BIG_1000("Big (1000ml)");

    private final String displayName;

    DrinkSizes(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
