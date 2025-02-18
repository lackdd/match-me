package com.app.matchme.services;

import com.app.matchme.entities.*;
import com.app.matchme.mappers.UserMapper;
import com.app.matchme.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JWTService jwtService;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    private UserDetailsService userDetailsService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User register(User user) {
        if (repo.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public boolean checkEmail(String email) {
        return repo.existsByEmail(email);
    }

    public boolean validate(String token) {
        String email = jwtService.extractUserName(token);
        UserDetails userdetails = userDetailsService.loadUserByUsername(email);
        return jwtService.validateToken(token, userdetails);
    }

    public String extractUserEmail(String token) {
        String email = jwtService.extractUserName(token);
        return email;
    }

    public Long extractUserId(String token) {
        Long id = jwtService.extractUserId(token);
        return id;
    }

    public Optional<UserDTO> getUserById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toDTO);
    }

    //filteredUsers.stream().map(User::getId).forEach(System.out::println);

        /*List<User> filteredUsers = users.stream()
                .filter(user -> !Objects.equals(user.getId(), currentUser.getId()))
                .filter(user -> ("same_city".equals(idealMatchLocation) && Objects.equals(user.getLocation(), currentUser.getLocation())) || "same_country".equals(idealMatchLocation) )
                .filter(user -> user.getAge() >= minAge && user.getAge() <= maxAge)
                .filter(user -> Objects.equals(user.getGender(), currentUser.getIdealMatchGender()))
                .toList();
        filteredUsers.stream().map(User::getId).forEach(System.out::println);*/

    /*
    * how to know which user profiles to recommend to the user?
    * recommendation algorithm should start when user enters /recommendations
    * there should be hard criteriums and soft criteriums-
    * hard criteriums mean 100% excluded, soft criteriums mean possible recommendation
    * location, age, gender can be hard criteriums
    * 1) program takes into account only people in location range derived from user preference
    * 2) program excludes people who arent aligned with user's age, and gender preferences
    * 3) program compares users idealMatch biographic datapoints to the rest of the users basic info that werent excluded from previous steps
    * 4) for each matched datapoint for example could give +1 points
    * 5) create a list of 10 recommendations that got the most points and send them to frontend
    * */

    public List<Long> findMatches(Long id) {
        List<User> users = repo.findAll();
        Optional<User> optionalUser = repo.findById(id);
        User currentUser = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));
        Integer minAge = Integer.parseInt(currentUser.getIdealMatchAge().substring(0, 2));
        Integer maxAge = Integer.parseInt(currentUser.getIdealMatchAge().substring(3, 5));
        String idealMatchLocation = currentUser.getIdealMatchLocation();

        Map<User, Integer> userPointsMap = users.stream()
                .filter(user -> !Objects.equals(user.getId(), currentUser.getId()))
                .filter(user -> ("same_city".equals(idealMatchLocation) && Objects.equals(user.getLocation(), currentUser.getLocation())) || "same_country".equals(idealMatchLocation) || "anywhere".equals(idealMatchLocation))
                .filter(user -> user.getAge() >= minAge && user.getAge() <= maxAge)
                .filter(user -> Objects.equals(user.getGender(), currentUser.getIdealMatchGender()))
                .collect(Collectors.toMap(user -> user, user -> calculatePoints(user, currentUser)));

        return userPointsMap.entrySet().stream()
                .sorted(Map.Entry.<User, Integer>comparingByValue().reversed())
                .limit(10)
                .peek(entry -> System.out.println("user id: " + entry.getKey().getId() + " points: " + entry.getValue()))
                .map(entry -> entry.getKey().getId())
                .collect(Collectors.toList());
    }

    public Integer calculatePoints(User user, User currentUser) {
        int points = 0;
        List<String> musicGenres = user.getPreferredMusicGenres();
        List<String> methods = user.getPreferredMethods();
        List<String> goals = user.getGoalsWithMusic();
        Integer experience = user.getYearsOfMusicExperience();
        Integer idealMatchExperienceMin = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(0, 1));
        Integer idealMatchExperienceMax = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(2, 3));

        for (String item : musicGenres) {
            if (currentUser.getIdealMatchGenres().contains(item)) {
                points++;
            }
        }

        for (String item : methods) {
            if (currentUser.getIdealMatchMethods().contains(item)) {
                points++;
            }
        }

        for (String item : goals) {
            if (currentUser.getIdealMatchGoals().contains(item)) {
                points++;
            }
        }

        if (experience >= idealMatchExperienceMin && experience <= idealMatchExperienceMax ) {
            points++;
        }
        return points;
    }

    public Optional<UsernamePictureDTO> getUserNameAndPictureById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toUsernamePictureDTO);
    }

    /*public Optional<UsernamePictureDTO> getUserNameAndPictureByEmail(String email) {
        return repo.findByEmail(email)
                .map(UserMapper::toUsernamePictureDTO);
    }*/

    public Optional<ProfileDTO> getUserProfileById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toProfileDTO);
    }

    /*public Optional<ProfileDTO> getUserProfileByEmail(String email) {
        return repo.findByEmail(email)
                .map(UserMapper::toProfileDTO);
    }*/

    public Optional<BioDTO> getUserBioById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toBioDTO);
    }

    /*public Optional<BioDTO> getUserBioByEmail(String email) {
        return repo.findByEmail(email)
                .map(UserMapper::toBioDTO);
    }*/

    public String verify(User user) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            User authenticatedUser = repo.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return jwtService.generateToken(authenticatedUser);
        }

        return "fail";
    }
}
