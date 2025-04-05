package com.app.matchme.dtos.apirequestdtos;

import jakarta.validation.constraints.*;

import java.util.List;

public record RegisterRequest(
        @NotBlank(message = "Email is missing")
        @Email(message = "Email input not in email format")
        @Size(max = 50, message = "Email length cannot exceed 50 characters")
        String email,
        @NotBlank(message = "Password cannot be empty")
        @Size(min = 3, max = 50, message = "Password must be between 6 and 30 characters")
        String password,
        @NotBlank(message = "Username cannot be empty")
        String username,
        String profilePicture,
        @NotBlank(message = "Gender is missing")
        String gender,
        @NotNull(message = "Age cannot be null")
        @PositiveOrZero(message = "Age cannot be negative")
        @Min(value = 16, message = "Age must be at least 16")
        @Max(value = 120, message = "Age cannot be more than 120")
        Integer age,
        @NotNull(message = "Preferred music genres is missing")
        @NotEmpty(message = "Preferred music genres cannot be empty")
        List<String> preferredMusicGenres,
        @NotEmpty(message = "Preferred methods cannot be empty")
        @NotNull(message = "Preferred methods is missing")
        List<String> preferredMethods,
        @NotEmpty(message = "Additional interests cannot be empty")
        @NotNull(message = "Additional interests is missing")
        List<String> additionalInterests,
        @NotEmpty(message = "Personality traits cannot be empty")
        @NotNull(message = "Personality traits is missing")
        List<String> personalityTraits,
        @NotEmpty(message = "Goals with music cannot be empty")
        @NotNull(message = "Goals with music is missing")
        List<String> goalsWithMusic,
        @NotNull(message = "Years of music experience is missing")
        @PositiveOrZero(message = "Years of music experience cannot be negative")
        Integer yearsOfMusicExperience,
        String location,
        Double latitude,
        Double longitude,
        Integer maxMatchRadius,
        @NotNull(message = "Ideal match genres is missing")
        @NotEmpty(message = "Ideal match genres cannot be empty")
        List<String> idealMatchGenres,
        @NotEmpty(message = "Ideal match methods cannot be empty")
        @NotNull(message = "Ideal match methods is missing")
        List<String> idealMatchMethods,
        @NotEmpty(message = "Ideal match goals cannot be empty")
        @NotNull(message = "Ideal match goals is missing")
        List<String> idealMatchGoals,
        @NotBlank(message = "Ideal match gender is missing")
        String idealMatchGender,
        @NotBlank(message = "Ideal match age is missing")
        String idealMatchAge,
        @NotBlank(message = "Ideal match years of experience is missing")
        String idealMatchYearsOfExperience,
        @NotBlank(message = "Ideal match location is missing")
        String idealMatchLocation
        ) { }
