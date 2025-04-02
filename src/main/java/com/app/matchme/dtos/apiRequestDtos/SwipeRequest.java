package com.app.matchme.dtos.apiRequestDtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SwipeRequest(
        @NotNull(message = "matchId cannot be null")
        @Positive(message = "matchId cannot be negative or zero")
        Long matchId,
        boolean swipedRight) {
}
