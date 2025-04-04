package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ConnectionRequest(
        @NotNull(message = "Match ID is missing")
        @Positive(message = "Match ID must be a positive number")
        Long matchId) {
}
