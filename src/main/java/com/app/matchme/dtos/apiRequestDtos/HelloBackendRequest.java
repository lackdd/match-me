package com.app.matchme.dtos.apiRequestDtos;

import jakarta.validation.constraints.NotBlank;

public record HelloBackendRequest (
        @NotBlank(message = "Message cannot be null or empty")
        String message) {
}
