package com.app.matchme.dtos.apiRequestDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record LocationRequest(
        @NotBlank(message = "Location is missing")
        String location,
        @NotNull(message = "Latitude cannot be null")
        Double latitude,
        @NotNull(message = "Longitude cannot be null")
        Double longitude,
        Integer maxMatchRadius
) {
}
