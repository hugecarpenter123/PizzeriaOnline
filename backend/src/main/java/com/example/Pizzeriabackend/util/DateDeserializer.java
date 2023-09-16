package com.example.Pizzeriabackend.util;

import com.example.Pizzeriabackend.exception.CustomExceptionHandler;
import com.example.Pizzeriabackend.exception.DateParsingException;
import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;

public class DateDeserializer extends JsonDeserializer<LocalDate> {
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    @Override
    public LocalDate deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) {
        System.out.println("================Deserialization");

        try {
            String dateStr = jsonParser.getText();
            System.out.println("\tdateStr: " + dateStr);
            LocalDate parseDate = LocalDate.parse(dateStr, dateFormatter); // there error occurs
            System.out.println("\tparseDate: " + parseDate);
            return parseDate;
        } catch (DateTimeParseException e) {
            System.out.println("DateTimeParseException-----------------");
            throw new GeneralBadRequestException("DateTimeParseException catch fired");
        } catch (IOException e) {
            System.out.println("IOException-----------------");
            throw new GeneralBadRequestException("IOException try-catch fired");
        } catch (RuntimeException e) {
            System.out.println("RuntimeException-----------------");
            throw new GeneralBadRequestException("Some error got thrown");
        }
    }
}