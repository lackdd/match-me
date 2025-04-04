package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Email is missing")
        @Email(message = "Email input not in email format")
        @Size(max = 50, message = "Email length cannot exceed 50 characters")
        String email,
        @NotBlank(message = "Password is missing")
        String password) {
}
