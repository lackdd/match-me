package com.app.matchme.dtos.apiRequestDtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record LocationRequest(
        String location,
        Double latitude,
        Double longitude,
        Integer maxMatchRadius
) {
}
