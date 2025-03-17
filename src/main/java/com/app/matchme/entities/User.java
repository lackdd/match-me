package com.app.matchme.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String username;
    private String gender;
    private Integer age;
    private String profilePicture;

    @ElementCollection
    @CollectionTable(name = "user_music_genres", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "genre")
    private List<String> preferredMusicGenres = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "user_methods", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "method")
    private List<String> preferredMethods = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "user_additional_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    private List<String> additionalInterests = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "user_personality_traits", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "trait")
    private List<String> personalityTraits = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "user_goals_with_music", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "goal")
    private List<String> goalsWithMusic = new ArrayList<>();
    private Integer yearsOfMusicExperience;
    private String linkToMusic;
    private String location;
    private String description;
    @ElementCollection
    @CollectionTable(name = "user_ideal_match_genres", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "genre")
    private List<String> idealMatchGenres = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "user_ideal_match_methods", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "method")
    private List<String> idealMatchMethods = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "connections", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "connection_id")
    private List<Long> connections = new ArrayList<>();
    @ElementCollection
    @CollectionTable(name = "user_ideal_match_goals", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "goal")
    private List<String> idealMatchGoals = new ArrayList<>();
    private String idealMatchGender;
    private String idealMatchAge;
    private String idealMatchYearsOfExperience;
    private String idealMatchLocation;

    @ElementCollection
    @CollectionTable(name = "liked_user_ids", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "liked_user_id")
    private List<Long> likedUsers = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "pending_requests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "pending_request")
    private List<Long> pendingRequests = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "already_swiped_users", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "swiped_user")
    private List<Long> swipedUsers = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessage> receivedMessages = new ArrayList<>();


    public User() {
    }

    public User(Long id, String email, String password, String username, String gender, Integer age, String profilePicture, List<String> preferredMethods, List<String> additionalInterests, List<String> preferredMusicGenres, List<String> personalityTraits, String linkToMusic, String description, Integer yearsOfMusicExperience, List<String> goalsWithMusic, String location, List<String> idealMatchGenres, List<String> idealMatchMethods, List<Long> connections, String idealMatchGender, List<Long> pendingRequests, String idealMatchYearsOfExperience, String idealMatchAge, List<String> idealMatchGoals, List<Long> likedUsers, String idealMatchLocation, List<ChatMessage> sentMessages, List<Long> swipedUsers, List<ChatMessage> receivedMessages) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.gender = gender;
        this.age = age;
        this.profilePicture = profilePicture;
        this.preferredMethods = preferredMethods;
        this.additionalInterests = additionalInterests;
        this.preferredMusicGenres = preferredMusicGenres;
        this.personalityTraits = personalityTraits;
        this.linkToMusic = linkToMusic;
        this.description = description;
        this.yearsOfMusicExperience = yearsOfMusicExperience;
        this.goalsWithMusic = goalsWithMusic;
        this.location = location;
        this.idealMatchGenres = idealMatchGenres;
        this.idealMatchMethods = idealMatchMethods;
        this.connections = connections;
        this.idealMatchGender = idealMatchGender;
        this.pendingRequests = pendingRequests;
        this.idealMatchYearsOfExperience = idealMatchYearsOfExperience;
        this.idealMatchAge = idealMatchAge;
        this.idealMatchGoals = idealMatchGoals;
        this.likedUsers = likedUsers;
        this.idealMatchLocation = idealMatchLocation;
        this.sentMessages = sentMessages;
        this.swipedUsers = swipedUsers;
        this.receivedMessages = receivedMessages;
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

    public List<String> getPreferredMethods() {
        return preferredMethods;
    }

    public void setPreferredMethods(List<String> preferredMethods) {
        this.preferredMethods = preferredMethods;
    }

    public List<String> getPreferredMusicGenres() {
        return preferredMusicGenres;
    }

    public void setPreferredMusicGenres(List<String> preferredMusicGenres) {
        this.preferredMusicGenres = preferredMusicGenres;
    }

    public List<String> getPersonalityTraits() {
        return personalityTraits;
    }

    public void setPersonalityTraits(List<String> personalityTraits) {
        this.personalityTraits = personalityTraits;
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

    public String getLinkToMusic() {
        return linkToMusic;
    }

    public void setLinkToMusic(String linkToMusic) {
        this.linkToMusic = linkToMusic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getYearsOfMusicExperience() {
        return yearsOfMusicExperience;
    }

    public void setYearsOfMusicExperience(Integer yearsOfMusicExperience) {
        this.yearsOfMusicExperience = yearsOfMusicExperience;
    }

    public List<String> getIdealMatchGenres() {
        return idealMatchGenres;
    }

    public void setIdealMatchGenres(List<String> idealMatchGenres) {
        this.idealMatchGenres = idealMatchGenres;
    }

    public List<String> getIdealMatchMethods() {
        return idealMatchMethods;
    }

    public void setIdealMatchMethods(List<String> idealMatchMethods) {
        this.idealMatchMethods = idealMatchMethods;
    }

    public List<String> getIdealMatchGoals() {
        return idealMatchGoals;
    }

    public void setIdealMatchGoals(List<String> idealMatchGoals) {
        this.idealMatchGoals = idealMatchGoals;
    }

    public String getIdealMatchGender() {
        return idealMatchGender;
    }

    public void setIdealMatchGender(String idealMatchGender) {
        this.idealMatchGender = idealMatchGender;
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

    public List<Long> getConnections() {
        return connections;
    }

    public void setConnections(List<Long> connections) {
        this.connections = connections;
    }

    public List<Long> getLikedUsers() {
        return likedUsers;
    }

    public void setLikedUsers(List<Long> likedUsers) {
        this.likedUsers = likedUsers;
    }

    public List<Long> getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(List<Long> pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public List<ChatMessage> getSentMessages() {
        return sentMessages;
    }

    public void setSentMessages(List<ChatMessage> sentMessages) {
        this.sentMessages = sentMessages;
    }

    public List<ChatMessage> getReceivedMessages() {
        return receivedMessages;
    }

    public void setReceivedMessages(List<ChatMessage> receivedMessages) {
        this.receivedMessages = receivedMessages;
    }

    public List<Long> getSwipedUsers() {
        return swipedUsers;
    }

    public void setSwipedUsers(List<Long> swipedUsers) {
        this.swipedUsers = swipedUsers;
    }
}
