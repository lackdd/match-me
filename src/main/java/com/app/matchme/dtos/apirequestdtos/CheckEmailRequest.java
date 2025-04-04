package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CheckEmailRequest(
        @NotBlank(message = "Email is missing")
        @Email(message = "Must be valid email")
        String email) {
}
