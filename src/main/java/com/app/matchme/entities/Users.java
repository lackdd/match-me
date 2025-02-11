package com.app.matchme.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String username;
    private String gender;
    private Integer age;
    private String profilePicture;
    private String preferredMusicGenres;
    private String preferredMethods;
    private String additionalInterests;
    private String personalityTraits;
    private String goalsWithMusic;
    private Integer yearsOfMusicExperience;
    private String linkToMusic;
    private String location;
    private String description;
    private String idealMatchGenres;
    private String idealMatchMethods;
    private String idealMatchGoals;
    private String idealMatchGender;
    private String idealMatchAge;
    private String idealMatchYearsOfExperience;
    private String idealMatchLocation;



    public Users() {}

    public Users(Long id, String email, String password, String username, Integer age, String gender, String profilePicture, String preferredMethods, String additionalInterests, String preferredMusicGenres, String goalsWithMusic, String personalityTraits, String linkToMusic, Integer yearsOfMusicExperience, String description, String location, String idealMatchMethods, String idealMatchGender, String idealMatchGenres, String idealMatchGoals, String idealMatchAge, String idealMatchLocation, String idealMatchYearsOfExperience) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.age = age;
        this.gender = gender;
        this.profilePicture = profilePicture;
        this.preferredMethods = preferredMethods;
        this.additionalInterests = additionalInterests;
        this.preferredMusicGenres = preferredMusicGenres;
        this.goalsWithMusic = goalsWithMusic;
        this.personalityTraits = personalityTraits;
        this.linkToMusic = linkToMusic;
        this.yearsOfMusicExperience = yearsOfMusicExperience;
        this.description = description;
        this.location = location;
        this.idealMatchMethods = idealMatchMethods;
        this.idealMatchGender = idealMatchGender;
        this.idealMatchGenres = idealMatchGenres;
        this.idealMatchGoals = idealMatchGoals;
        this.idealMatchAge = idealMatchAge;
        this.idealMatchLocation = idealMatchLocation;
        this.idealMatchYearsOfExperience = idealMatchYearsOfExperience;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {return username;}

    public void setUsername(String username) {this.username = username;}

    public String getGender() {return gender;}

    public void setGender(String gender){this.gender = gender;}

    public Integer getAge() {return age;}

    public void setAge(Integer age) {this.age = age;}

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getPreferredMethods() {
        return preferredMethods;
    }

    public void setPreferredMethods(String preferredMethods) {
        this.preferredMethods = preferredMethods;
    }

    public String getPreferredMusicGenres() {
        return preferredMusicGenres;
    }

    public void setPreferredMusicGenres(String preferredMusicGenres) {
        this.preferredMusicGenres = preferredMusicGenres;
    }

    public String getAdditionalInterests() {
        return additionalInterests;
    }

    public void setAdditionalInterests(String additionalInterests) {
        this.additionalInterests = additionalInterests;
    }

    public String getPersonalityTraits() {
        return personalityTraits;
    }

    public void setPersonalityTraits(String personalityTraits) {
        this.personalityTraits = personalityTraits;
    }

    public String getGoalsWithMusic() {
        return goalsWithMusic;
    }

    public void setGoalsWithMusic(String goalsWithMusic) {
        this.goalsWithMusic = goalsWithMusic;
    }

    public Integer getYearsOfMusicExperience() {
        return yearsOfMusicExperience;
    }

    public void setYearsOfMusicExperience(Integer yearsOfMusicExperience) {
        this.yearsOfMusicExperience = yearsOfMusicExperience;
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

    public String getIdealMatchGenres() {
        return idealMatchGenres;
    }

    public void setIdealMatchGenres(String idealMatchGenres) {
        this.idealMatchGenres = idealMatchGenres;
    }

    public String getIdealMatchMethods() {
        return idealMatchMethods;
    }

    public void setIdealMatchMethods(String idealMatchMethods) {
        this.idealMatchMethods = idealMatchMethods;
    }

    public String getIdealMatchAge() {
        return idealMatchAge;
    }

    public void setIdealMatchAge(String idealMatchAge) {
        this.idealMatchAge = idealMatchAge;
    }

    public String getIdealMatchGoals() {
        return idealMatchGoals;
    }

    public void setIdealMatchGoals(String idealMatchGoals) {
        this.idealMatchGoals = idealMatchGoals;
    }

    public String getIdealMatchGender() {
        return idealMatchGender;
    }

    public void setIdealMatchGender(String idealMatchGender) {
        this.idealMatchGender = idealMatchGender;
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
