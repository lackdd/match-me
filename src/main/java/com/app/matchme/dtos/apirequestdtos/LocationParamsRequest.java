package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.bind.DefaultValue;

public record LocationParamsRequest(
        @Min(value = 1, message = "Radius must be at least 1 km")
        @Max(value = 500, message = "Radius cannot exceed 500 km")
        @DefaultValue("50")
        Integer radius
) {
}
