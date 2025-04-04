package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordCheckRequest(
        @NotBlank(message = "Current password is missing")
        @Size(min = 6, max = 30, message = "Password has to be between 6 and 30 characters long")
        String password) {
}
