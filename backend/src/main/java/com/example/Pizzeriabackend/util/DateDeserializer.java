package com.example.Pizzeriabackend.util;

import com.example.Pizzeriabackend.exception.DateParsingException;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateDeserializer {
    public static LocalDate parseDate(String stringDate) {
        try {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            return LocalDate.parse(stringDate, dateFormatter);
        } catch (DateTimeParseException e) {
            throw new DateParsingException("Improper `dateOfBirth` value, format should be: `dd-MM-yyyy`");
        }
    }
}