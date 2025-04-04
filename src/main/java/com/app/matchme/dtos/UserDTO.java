package com.app.matchme.dtos;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserDTO {
    @NotNull(message = "Id can't be null")
    @Positive(message = "Id must be positive")
    private Long id;
    private String email;
    private String password;
    private String profilePicture;

    @NotBlank(message = "Gender is missing")
    private String gender;
    @NotNull(message = "Age cannot be null")
    @PositiveOrZero(message = "Age cannot be negative")
    @Size(min = 16, max = 120, message = "Age must be between 16 and 120")
    private Integer age;
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
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer maxMatchRadius;
    @NotNull(message = "Ideal match genres is missing")
    @NotEmpty(message = "Ideal match genres cannot be empty")
    private List<String> idealMatchGenres;
    @NotEmpty(message = "Ideal match methods cannot be empty")
    @NotNull(message = "Ideal match methods is missing")
    private List<String> idealMatchMethods;
    @NotEmpty(message = "Ideal match goals cannot be empty")
    @NotNull(message = "Ideal match goals is missing")
    private List<String> idealMatchGoals;
    @NotBlank(message = "Ideal match gender is missing")
    private String idealMatchGender;
    @NotBlank(message = "Ideal match age is missing")
    private String idealMatchAge;
    @NotBlank(message = "Ideal match years of experience is missing")
    private String idealMatchYearsOfExperience;
    @NotBlank(message = "Ideal match location is missing")
    private String idealMatchLocation;
}
