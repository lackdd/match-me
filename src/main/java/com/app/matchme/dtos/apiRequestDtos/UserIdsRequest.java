package com.app.matchme.dtos.apiRequestDtos;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UserIdsRequest (
        @NotNull(message = "List of User IDs cannot be null")
        List<Long> ids
) {
}
