package com.app.matchme.entities;

import java.util.List;

public class ProfileDTO {
    private Long id;
    private String gender;
    private Integer age;
    private String linkToMusic;
    private String location;
    private String description;
    private List<String> preferredMusicGenres;
    private List<String> preferredMethod;
    private List<String> additionalInterests;
    private List<String> personalityTraits;
    private List<String> goalsWithMusic;
    private Integer yearsOfMusicExperience;

    public ProfileDTO() {
    }

    public ProfileDTO(Long id, String gender, Integer age, String location, String linkToMusic, String description, List<String> preferredMusicGenres, List<String> preferredMethod, List<String> personalityTraits, List<String> additionalInterests, List<String> goalsWithMusic, Integer yearsOfMusicExperience) {
        this.id = id;
        this.gender = gender;
        this.age = age;
        this.location = location;
        this.linkToMusic = linkToMusic;
        this.preferredMusicGenres = preferredMusicGenres;
        this.description = description;
        this.preferredMethod = preferredMethod;
        this.personalityTraits = personalityTraits;
        this.additionalInterests = additionalInterests;
        this.goalsWithMusic = goalsWithMusic;
        this.yearsOfMusicExperience = yearsOfMusicExperience;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getLinkToMusic() {
        return linkToMusic;
    }

    public void setLinkToMusic(String linkToMusic) {
        this.linkToMusic = linkToMusic;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getPreferredMusicGenres() {
        return preferredMusicGenres;
    }

    public void setPreferredMusicGenres(List<String> preferredMusicGenres) {
        this.preferredMusicGenres = preferredMusicGenres;
    }

    public List<String> getAdditionalInterests() {
        return additionalInterests;
    }

    public void setAdditionalInterests(List<String> additionalInterests) {
        this.additionalInterests = additionalInterests;
    }

    public List<String> getPreferredMethod() {
        return preferredMethod;
    }

    public void setPreferredMethod(List<String> preferredMethod) {
        this.preferredMethod = preferredMethod;
    }

    public List<String> getGoalsWithMusic() {
        return goalsWithMusic;
    }

    public void setGoalsWithMusic(List<String> goalsWithMusic) {
        this.goalsWithMusic = goalsWithMusic;
    }

    public List<String> getPersonalityTraits() {
        return personalityTraits;
    }

    public void setPersonalityTraits(List<String> personalityTraits) {
        this.personalityTraits = personalityTraits;
    }

    public Integer getYearsOfMusicExperience() {
        return yearsOfMusicExperience;
    }

    public void setYearsOfMusicExperience(Integer yearsOfMusicExperience) {
        this.yearsOfMusicExperience = yearsOfMusicExperience;
    }
}
