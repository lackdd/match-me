package com.app.matchme.entities;

import lombok.Data;

import java.util.List;

@Data
public class ProfileDTO {
    private Long id;
    private String gender;
    private Integer age;
    private String linkToMusic;
    private String location;
    private Double latitude;
    private Double longitude;
    private Integer maxMatchRadius;
    private String description;
    private List<String> preferredMusicGenres;
    private List<String> preferredMethod;
    private List<String> additionalInterests;
    private List<String> personalityTraits;
    private List<String> goalsWithMusic;
    private Integer yearsOfMusicExperience;
}
