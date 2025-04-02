package com.app.matchme.dtos.apiRequestDtos;

import jakarta.validation.constraints.*;

public record PasswordChangeRequest(
        @NotBlank(message = "Current password is missing")
        @Size(max = 30, message = "Password cannot exceed 30 characters")
        String oldPassword,

        @NotBlank(message = "New password is missing")
        @Size(min = 6, max = 30, message = "Password must be between 6 and 30 characters")
        String newPassword
) {
}
