package com.app.matchme.entities;

import java.util.List;

public class BioDTO {
    private String gender;
    private Integer age;
    private List<String> preferredMusicGenres;
    private List<String> preferredMethod;
    private List<String> additionalInterests;
    private List<String> personalityTraits;
    private List<String> goalsWithMusic;
    private Integer yearsOfMusicExperience;
    private String location;
    private List<String> idealMatchGenres;
    private List<String> idealMatchMethods;
    private List<String> idealMatchGoals;
    private String idealMatchGender;
    private String idealMatchAge;
    private String idealMatchYearsOfExperience;
    private String idealMatchLocation;

    public BioDTO() {
    }

    public BioDTO(String gender, Integer age, List<String> preferredMusicGenres, List<String> additionalInterests, List<String> preferredMethod, List<String> personalityTraits, List<String> goalsWithMusic, List<String> idealMatchGenres, String location, Integer yearsOfMusicExperience, List<String> idealMatchGoals, List<String> idealMatchMethods, String idealMatchAge, String idealMatchGender, String idealMatchLocation, String idealMatchYearsOfExperience) {
        this.gender = gender;
        this.age = age;
        this.preferredMusicGenres = preferredMusicGenres;
        this.additionalInterests = additionalInterests;
        this.preferredMethod = preferredMethod;
        this.personalityTraits = personalityTraits;
        this.goalsWithMusic = goalsWithMusic;
        this.idealMatchGenres = idealMatchGenres;
        this.location = location;
        this.yearsOfMusicExperience = yearsOfMusicExperience;
        this.idealMatchGoals = idealMatchGoals;
        this.idealMatchMethods = idealMatchMethods;
        this.idealMatchAge = idealMatchAge;
        this.idealMatchGender = idealMatchGender;
        this.idealMatchLocation = idealMatchLocation;
        this.idealMatchYearsOfExperience = idealMatchYearsOfExperience;
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

    public List<String> getPreferredMusicGenres() {
        return preferredMusicGenres;
    }

    public void setPreferredMusicGenres(List<String> preferredMusicGenres) {
        this.preferredMusicGenres = preferredMusicGenres;
    }

    public List<String> getPreferredMethod() {
        return preferredMethod;
    }

    public void setPreferredMethod(List<String> preferredMethod) {
        this.preferredMethod = preferredMethod;
    }

    public List<String> getAdditionalInterests() {
        return additionalInterests;
    }

    public void setAdditionalInterests(List<String> additionalInterests) {
        this.additionalInterests = additionalInterests;
    }

    public List<String> getPersonalityTraits() {
        return personalityTraits;
    }

    public void setPersonalityTraits(List<String> personalityTraits) {
        this.personalityTraits = personalityTraits;
    }

    public List<String> getGoalsWithMusic() {
        return goalsWithMusic;
    }

    public void setGoalsWithMusic(List<String> goalsWithMusic) {
        this.goalsWithMusic = goalsWithMusic;
    }

    public Integer getYearsOfMusicExperience() {
        return yearsOfMusicExperience;
    }

    public void setYearsOfMusicExperience(Integer yearsOfMusicExperience) {
        this.yearsOfMusicExperience = yearsOfMusicExperience;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getIdealMatchMethods() {
        return idealMatchMethods;
    }

    public void setIdealMatchMethods(List<String> idealMatchMethods) {
        this.idealMatchMethods = idealMatchMethods;
    }

    public List<String> getIdealMatchGenres() {
        return idealMatchGenres;
    }

    public void setIdealMatchGenres(List<String> idealMatchGenres) {
        this.idealMatchGenres = idealMatchGenres;
    }

    public String getIdealMatchGender() {
        return idealMatchGender;
    }

    public void setIdealMatchGender(String idealMatchGender) {
        this.idealMatchGender = idealMatchGender;
    }

    public List<String> getIdealMatchGoals() {
        return idealMatchGoals;
    }

    public void setIdealMatchGoals(List<String> idealMatchGoals) {
        this.idealMatchGoals = idealMatchGoals;
    }

    public String getIdealMatchAge() {
        return idealMatchAge;
    }

    public void setIdealMatchAge(String idealMatchAge) {
        this.idealMatchAge = idealMatchAge;
    }

    public String getIdealMatchYearsOfExperience() {
        return idealMatchYearsOfExperience;
    }

    public void setIdealMatchYearsOfExperience(String idealMatchYearsOfExperience) {
        this.idealMatchYearsOfExperience = idealMatchYearsOfExperience;
    }

    public String getIdealMatchLocation() {
        return idealMatchLocation;
    }

    public void setIdealMatchLocation(String idealMatchLocation) {
        this.idealMatchLocation = idealMatchLocation;
    }
}
