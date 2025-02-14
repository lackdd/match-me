package com.app.matchme.entities;

import java.util.List;

public class UserProfileDTO {
    private Long id;
    private String email;
    private String username;
    private String gender;
    private Integer age;
    private String profilePicture;
    private List<String> preferredMusicGenres;
    private List<String> preferredMethod;
    private List<String> additionalInterests;
    private List<String> personalityTraits;
    private List<String> goalsWithMusic;
    private Integer yearsOfMusicExperience;
    private String linkToMusic;
    private String location;
    private String description;
    private List<String> idealMatchGenres;
    private List<String> idealMatchMethods;
    private List<String> idealMatchGoals;
    private String idealMatchGender;
    private String idealMatchAge;
    private String idealMatchYearsOfExperience;
    private String idealMatchLocation;

    public UserProfileDTO() {
    }

    public UserProfileDTO(Long id, String username, String email, String gender, String profilePicture, Integer age, List<String> preferredMethod, List<String> preferredMusicGenres, List<String> personalityTraits, List<String> additionalInterests, Integer yearsOfMusicExperience, List<String> goalsWithMusic, String location, String linkToMusic, String description, List<String> idealMatchGoals, List<String> idealMatchMethods, List<String> idealMatchGenres, String idealMatchGender, String idealMatchAge, String idealMatchYearsOfExperience, String idealMatchLocation) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.gender = gender;
        this.profilePicture = profilePicture;
        this.age = age;
        this.preferredMethod = preferredMethod;
        this.preferredMusicGenres = preferredMusicGenres;
        this.personalityTraits = personalityTraits;
        this.additionalInterests = additionalInterests;
        this.yearsOfMusicExperience = yearsOfMusicExperience;
        this.goalsWithMusic = goalsWithMusic;
        this.location = location;
        this.linkToMusic = linkToMusic;
        this.description = description;
        this.idealMatchGoals = idealMatchGoals;
        this.idealMatchMethods = idealMatchMethods;
        this.idealMatchGenres = idealMatchGenres;
        this.idealMatchGender = idealMatchGender;
        this.idealMatchAge = idealMatchAge;
        this.idealMatchYearsOfExperience = idealMatchYearsOfExperience;
        this.idealMatchLocation = idealMatchLocation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
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

    public List<String> getPersonalityTraits() {
        return personalityTraits;
    }

    public void setPersonalityTraits(List<String> personalityTraits) {
        this.personalityTraits = personalityTraits;
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

    public String getIdealMatchLocation() {
        return idealMatchLocation;
    }

    public void setIdealMatchLocation(String idealMatchLocation) {
        this.idealMatchLocation = idealMatchLocation;
    }

    public String getIdealMatchYearsOfExperience() {
        return idealMatchYearsOfExperience;
    }

    public void setIdealMatchYearsOfExperience(String idealMatchYearsOfExperience) {
        this.idealMatchYearsOfExperience = idealMatchYearsOfExperience;
    }
}
