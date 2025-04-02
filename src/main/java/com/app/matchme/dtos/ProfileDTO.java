package com.app.matchme.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProfileDTO {
    @NotNull(message = "Id can't be null")
    @Positive(message = "Id must be positive")
    private Long id;
    @NotBlank(message = "Gender is missing")
    private String gender;
    @NotNull(message = "Age cannot be null")
    @PositiveOrZero(message = "Age cannot be negative")
    @Size(min = 16, max = 120, message = "Age must be between 16 and 120")
    private Integer age;
    private String linkToMusic;
    @NotBlank(message = "Location is missing")
    private String location;
    @NotNull(message = "Latitude can't be null")
    private Double latitude;
    @NotNull(message = "Longitude can't be null")
    private Double longitude;
    @NotNull(message = "Max match radius is missing")
    @PositiveOrZero(message = "Max match radius cannot be negative")
    private Integer maxMatchRadius;
    @Size(max = 300, message = "Description cannot exceed 300 characters")
    private String description;
    @NotNull(message = "Preferred music genres is missing")
    @NotEmpty(message = "Preferred music genres cannot be empty")
    private List<String> preferredMusicGenres;
    @NotEmpty(message = "Preferred methods cannot be empty")
    @NotNull(message = "Preferred methods is missing")
    private List<String> preferredMethod;
    @NotEmpty(message = "Additional interests cannot be empty")
    @NotNull(message = "Additional interests is missing")
    private List<String> additionalInterests;
    @NotEmpty(message = "Personality traits cannot be empty")
    @NotNull(message = "Personality traits is missing")
    private List<String> personalityTraits;
    @NotEmpty(message = "Goals with music cannot be empty")
    @NotNull(message = "Goals with music is missing")
    private List<String> goalsWithMusic;
    @NotNull(message = "Years of music experience is missing")
    @PositiveOrZero( message = "Years of music experience cannot be negative")
    private Integer yearsOfMusicExperience;
}
