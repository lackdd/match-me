package com.app.matchme.entities;

import jakarta.persistence.*;
import lombok.Data;

import org.locationtech.jts.geom.Point;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
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
    // keep the text location for display purposes
    private String location;

    // add geospatial coordinates
    @Column(columnDefinition = "geography(Point,4326)")
    private Point coordinates;

    // add maximum matching radius preference (in kilometers)
    private Integer maxMatchRadius = 50; // Default 50km

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
}
