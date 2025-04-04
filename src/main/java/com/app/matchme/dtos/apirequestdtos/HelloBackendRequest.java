package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.NotBlank;

public record HelloBackendRequest (
        @NotBlank(message = "Message cannot be null or empty")
        String message) {
}
