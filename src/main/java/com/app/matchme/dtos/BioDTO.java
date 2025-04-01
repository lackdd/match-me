package com.app.matchme.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BioDTO {
    private Long id;
    private String gender;
    private Integer age;
    private List<String> preferredMusicGenres;
    private List<String> preferredMethod;
    private List<String> additionalInterests;
    private List<String> personalityTraits;
    private List<String> goalsWithMusic;
    private Integer yearsOfMusicExperience;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer maxMatchRadius;
    private List<String> idealMatchGenres;
    private List<String> idealMatchMethods;
    private List<String> idealMatchGoals;
    private String idealMatchGender;
    private String idealMatchAge;
    private String idealMatchYearsOfExperience;
    private String idealMatchLocation;
}
