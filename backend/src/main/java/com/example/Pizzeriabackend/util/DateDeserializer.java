package com.example.Pizzeriabackend.util;

import com.example.Pizzeriabackend.exception.GeneralBadRequestException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateDeserializer extends JsonDeserializer<LocalDate> {
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    @Override
    public LocalDate deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) {

        try {
            String dateStr = jsonParser.getText();
            return LocalDate.parse(dateStr, dateFormatter);
        } catch (DateTimeParseException e) {
            throw new GeneralBadRequestException("DateTimeParseException catch fired");
        } catch (IOException e) {
            throw new GeneralBadRequestException("IOException try-catch fired");
        } catch (RuntimeException e) {
            throw new GeneralBadRequestException("Some error got thrown");
        }
    }
}