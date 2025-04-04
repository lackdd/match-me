package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfilePictureRequest(
        @NotBlank(message = "Profile picture URL is missing or empty")
        @Size(max = 200, message = "Max string size for profile picture is 200")
        String profilePicture) {
}
