package com.app.matchme.services;

import com.app.matchme.dtos.BioDTO;
import com.app.matchme.dtos.LocationUpdateDTO;
import com.app.matchme.dtos.ProfileDTO;
import com.app.matchme.dtos.UsernamePictureDTO;
import com.app.matchme.entities.*;
import com.app.matchme.exceptions.BusinessException;
import com.app.matchme.exceptions.RepositoryException;
import com.app.matchme.mappers.UserMapper;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.utils.GeoUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Point;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public void addConnectionById(Long id, User currentUser) {
        if (!currentUser.getPendingRequests().contains(id)) {
            System.out.println("You don't have this user in your pending requests, adding connection stopped.");
            return;
        }
        User likedUser = getUserById(id);
        currentUser.getConnections().add(id);
        likedUser.getConnections().add(currentUser.getId());
        userRepository.save(currentUser);
        userRepository.save(likedUser);
    }

    public void addLikedUserById(Long id, User currentUser) {
        if (!currentUser.getLikedUsers().contains(id)) {
            currentUser.getLikedUsers().add(id);
            userRepository.save(currentUser);
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User already in list");
        }
    }

    public void addPendingRequestById(Long id, User likedUser) {
        if (!likedUser.getPendingRequests().contains(id)) {
            likedUser.getPendingRequests().add(id);
            userRepository.save(likedUser);
        }
    }

    public void addToSwipedUsers(Long matchId, User currentUser) {
        if (!currentUser.getSwipedUsers().contains(matchId)) {
            currentUser.getSwipedUsers().add(matchId);
            userRepository.save(currentUser);
        }
    }

    @Transactional
    public boolean areUsersConnected(String sender, String receiver) {
        User senderUser = userRepository.findByUsername(sender).orElseThrow(() -> new RuntimeException("User not found"));
        Long senderId = senderUser.getId();
        User receiverUser = userRepository.findByUsername(receiver).orElseThrow(() -> new RuntimeException("User not found"));
        Long receiverId = receiverUser.getId();

        if (senderUser.getConnections().contains(receiverId) && receiverUser.getConnections().contains(senderId)) {
            System.out.println("Users are confirmed to be connected");
            return true;
        }
        System.out.println("Failed to confirm that users are connected");
        return false;
    }

    public Integer calculatePoints(User user, User currentUser) {
        int points = 0;
        List<String> musicGenres = user.getPreferredMusicGenres();
        List<String> methods = user.getPreferredMethods();
        List<String> goals = user.getGoalsWithMusic();
        Integer experience = user.getYearsOfMusicExperience();

        Integer idealMatchExperienceMin;
        Integer idealMatchExperienceMax;
        if (currentUser.getIdealMatchYearsOfExperience().length() == 5) {
            idealMatchExperienceMin = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(0, 2));
            idealMatchExperienceMax = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(3, 5));
        } else if (currentUser.getIdealMatchYearsOfExperience().length() == 4) {
            idealMatchExperienceMin = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(0, 1));
            idealMatchExperienceMax = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(2, 4));
        } else if (currentUser.getIdealMatchYearsOfExperience().trim().equals("any")) {
            idealMatchExperienceMin = 0;
            idealMatchExperienceMax = 100;
        } else if (currentUser.getIdealMatchYearsOfExperience().length() == 3) {
            idealMatchExperienceMin = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(0, 1));
            idealMatchExperienceMax = Integer.parseInt(currentUser.getIdealMatchYearsOfExperience().substring(2, 3));
        } else {
            throw new IllegalArgumentException("Ideal match years of experience not in bounds.");
        }

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

        if (currentUser.getIdealMatchYearsOfExperience() == "any" || (experience >= idealMatchExperienceMin && experience <= idealMatchExperienceMax)) {
            points++;
        }
        return points;
    }

    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean checkPassword(Long id, String password) {
        User currentUser = getUserById(id);
        return encoder.matches(password, currentUser.getPassword());
    }

    @Transactional
    public void deleteConnectionById(Long connectionId, User currentUser) {
        User connectedUser = userRepository.findById(connectionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (currentUser.getConnections().contains(connectionId) && connectedUser.getConnections().contains(currentUser.getId())) {
            currentUser.getConnections().remove(connectionId);
            connectedUser.getConnections().remove(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(connectedUser);
        }
    }

    @Transactional
    public void deletePendingRequestById(Long pendingRequestId, User currentUser) {
        User otherUser = userRepository.findById(pendingRequestId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (currentUser.getPendingRequests().contains(pendingRequestId)) {
            currentUser.getPendingRequests().remove(pendingRequestId);
            if (otherUser != null && otherUser.getLikedUsers().contains(currentUser.getId())) {
                otherUser.getLikedUsers().remove(currentUser.getId());
            }
        }
    }

    public void deleteProfilePicture(Long id) {
        User currentUser = getUserById(id);
        currentUser.setProfilePicture(null);
        userRepository.save(currentUser);
    }

    @Transactional
    public List<Long> findMatches(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        User currentUser = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));
        String idealMatchLocation = currentUser.getIdealMatchLocation();

        // Potential matches list - will be filtered based on location criteria
        List<User> potentialMatches;

        // Use proximity-based matching if coordinates are available and location preference isn't "anywhere"
        if (currentUser.getCoordinates() != null && !"anywhere".equals(idealMatchLocation)) {
            // If user has coordinates and wants location-based matching
            int radiusInMeters = currentUser.getMaxMatchRadius() * 1000; // Convert km to meters

            // Get users within the radius for proximity matching
            if ("same_city".equals(idealMatchLocation) || "same_country".equals(idealMatchLocation)) {
                // Get users near current user first
                potentialMatches = userRepository.findUsersWithinRadius(currentUser.getCoordinates().getY(), // Latitude
                        currentUser.getCoordinates().getX(), // Longitude
                        radiusInMeters, currentUser.getId());

                // Apply additional location text filtering
                if ("same_city".equals(idealMatchLocation)) {
                    potentialMatches = potentialMatches.stream().filter(user -> Objects.equals(user.getLocation(), currentUser.getLocation())).collect(Collectors.toList());
                } else if ("same_country".equals(idealMatchLocation)) {
                    // Extract country part from location (after the last comma)
                    potentialMatches = potentialMatches.stream().filter(user -> user.getLocation() != null && currentUser.getLocation() != null).filter(user -> Objects.equals(user.getLocation().substring(user.getLocation().lastIndexOf(",") + 1).trim(), currentUser.getLocation().substring(currentUser.getLocation().lastIndexOf(",") + 1).trim())).collect(Collectors.toList());
                }
            } else {
                // Just proximity-based without text filtering - "near me" type of matching
                potentialMatches = userRepository.findUsersWithinRadius(currentUser.getCoordinates().getY(), // Latitude
                        currentUser.getCoordinates().getX(), // Longitude
                        radiusInMeters, currentUser.getId());
            }
        } else {
            // Fall back to traditional location text matching if no coordinates or "anywhere" is selected
            potentialMatches = userRepository.findAll().stream().filter(user -> !Objects.equals(user.getId(), currentUser.getId())).filter(user -> "anywhere".equals(idealMatchLocation) || ("same_city".equals(idealMatchLocation) && Objects.equals(user.getLocation(), currentUser.getLocation())) || "same_country".equals(idealMatchLocation) && user.getLocation() != null && currentUser.getLocation() != null && Objects.equals(user.getLocation().substring(user.getLocation().lastIndexOf(",") + 1).trim(), currentUser.getLocation().substring(currentUser.getLocation().lastIndexOf(",") + 1).trim())).collect(Collectors.toList());
        }

        // Apply the remaining matching criteria (same logic as original method)
        Integer idealMatchAgeMin;
        Integer idealMatchAgeMax;
        if (currentUser.getIdealMatchAge().length() == 5) {
            idealMatchAgeMin = Integer.parseInt(currentUser.getIdealMatchAge().substring(0, 2));
            idealMatchAgeMax = Integer.parseInt(currentUser.getIdealMatchAge().substring(3, 5));
        } else if (currentUser.getIdealMatchAge().length() == 6) {
            idealMatchAgeMin = Integer.parseInt(currentUser.getIdealMatchAge().substring(0, 2));
            idealMatchAgeMax = Integer.parseInt(currentUser.getIdealMatchAge().substring(3, 6));
        } else if (currentUser.getIdealMatchAge().trim().equals("any")) {
            idealMatchAgeMin = 0;
            idealMatchAgeMax = 150;
        } else if (currentUser.getIdealMatchAge().length() == 7) {
            idealMatchAgeMin = Integer.parseInt(currentUser.getIdealMatchAge().substring(0, 3));
            idealMatchAgeMax = Integer.parseInt(currentUser.getIdealMatchAge().substring(4, 7));
        } else if (currentUser.getIdealMatchAge().equals("120+")) {
            idealMatchAgeMin = 120;
            idealMatchAgeMax = 1000;
        } else {
            throw new IllegalArgumentException("Ideal match age not in bounds.");
        }

        Map<User, Integer> userPointsMap = potentialMatches.stream().filter(user -> !currentUser.getSwipedUsers().contains(user.getId())).filter(user -> "any".equals(currentUser.getIdealMatchAge()) || (user.getAge() >= idealMatchAgeMin && user.getAge() <= idealMatchAgeMax)).filter(user -> "any".equals(currentUser.getIdealMatchGender()) || Objects.equals(user.getGender(), currentUser.getIdealMatchGender())).collect(Collectors.toMap(user -> user, user -> calculatePoints(user, currentUser)));

        return userPointsMap.entrySet().stream().sorted(Map.Entry.<User, Integer>comparingByValue().reversed()).limit(10).map(entry -> entry.getKey().getId()).collect(Collectors.toList());
    }

    @Transactional
    public List<Long> findUsersWithinRadius(Long userId, Integer radiusKm) {
        User currentUser = getUserById(userId);

        if (currentUser == null || currentUser.getCoordinates() == null) {
            return Collections.emptyList();
        }

        // Convert km to meters for the database query
        int radiusInMeters = radiusKm * 1000;

        // Use the userRepositorysitory method to find users within radius
        List<User> nearbyUsers = userRepository.findUsersWithinRadius(currentUser.getCoordinates().getY(),  // Latitude
                currentUser.getCoordinates().getX(),  // Longitude
                radiusInMeters, userId);

        // Map to IDs and filter out the current user (just in case)
        return nearbyUsers.stream().map(User::getId).filter(id -> !id.equals(userId)).collect(Collectors.toList());
    }

    public List<Long> getLikedUsersById(Long id) {
        return userRepository.findUserLikedUsersById(id).orElseThrow(() -> new RepositoryException("User not found with id: " + id));
    }

    public List<Long> getPendingRequestsById(Long id) {
        return userRepository.findUserPendingRequestsById(id).orElseThrow(() -> new RepositoryException("User not found with id: " + id));
    }

    public BioDTO getUserBioById(Long id) {
        return userRepository.findById(id).map(UserMapper::toBioDTO).orElseThrow(() -> new RepositoryException("User not found with id: " + id));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RepositoryException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RepositoryException("User not found in database with email: " + email));
    }

    public List<Long> getUserConnectionsById(Long id) {
        return userRepository.findUserConnectionsById(id).orElseThrow(() -> new RepositoryException("User connections not found with id: " + id));
    }

    public UsernamePictureDTO getUserNameAndPictureById(Long id) {
        return userRepository.findById(id).map(UserMapper::toUsernamePictureDTO).orElseThrow(() -> new RepositoryException("No user found with id: " + id));
    }

    public ProfileDTO getUserProfileById(Long id) {
        return userRepository.findById(id).map(UserMapper::toProfileDTO).orElseThrow(() -> new RepositoryException("No user found with id: " + id));
    }

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("Email already exists.");
        }

        user.setPassword(encoder.encode(user.getPassword()));


        return userRepository.save(user);
    }

    public void updateBio(Long id, BioDTO dto) {
        User currentUser = getUserById(id);
        if (dto.getIdealMatchGenres() != null) {
            currentUser.setIdealMatchGenres(dto.getIdealMatchGenres());
        }
        if (dto.getIdealMatchMethods() != null) {
            currentUser.setIdealMatchMethods(dto.getIdealMatchMethods());
        }
        if (dto.getIdealMatchGoals() != null) {
            currentUser.setIdealMatchGoals(dto.getIdealMatchGoals());
        }
        if (dto.getIdealMatchGender() != null) {
            currentUser.setIdealMatchGender(dto.getIdealMatchGender());
        }
        if (dto.getIdealMatchAge() != null) {
            currentUser.setIdealMatchAge(dto.getIdealMatchAge());
        }
        if (dto.getIdealMatchYearsOfExperience() != null) {
            currentUser.setIdealMatchYearsOfExperience(dto.getIdealMatchYearsOfExperience());
        }
        if (dto.getIdealMatchLocation() != null) {
            currentUser.setIdealMatchLocation(dto.getIdealMatchLocation());
        }
        userRepository.save(currentUser);
    }

    public void updatePassword(Long id, String oldPassword, String newPassword) {
        User currentUser = getUserById(id);
        if (!encoder.matches(oldPassword, currentUser.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect.");
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty.");
        }

        currentUser.setPassword(encoder.encode(newPassword));
        userRepository.save(currentUser);
    }

    public void updateProfile(Long id, ProfileDTO dto) {
        User currentUser = getUserById(id);

        // Update existing fields as before
        if (dto.getPreferredMusicGenres() != null) {
            currentUser.setPreferredMusicGenres(dto.getPreferredMusicGenres());
        }

        if (dto.getPreferredMethod() != null) {
            currentUser.setPreferredMethods(dto.getPreferredMethod());
        }

        if (dto.getAdditionalInterests() != null) {
            currentUser.setAdditionalInterests(dto.getAdditionalInterests());
        }

        if (dto.getPersonalityTraits() != null) {
            currentUser.setPersonalityTraits(dto.getPersonalityTraits());
        }

        if (dto.getGoalsWithMusic() != null) {
            currentUser.setGoalsWithMusic(dto.getGoalsWithMusic());
        }

        if (dto.getLinkToMusic() != null) {
            currentUser.setLinkToMusic(dto.getLinkToMusic());
        }

        if (dto.getLocation() != null) {
            currentUser.setLocation(dto.getLocation());
        }

        if (dto.getDescription() != null) {
            currentUser.setDescription(dto.getDescription());
        }

        if (dto.getYearsOfMusicExperience() != null) {
            currentUser.setYearsOfMusicExperience(dto.getYearsOfMusicExperience());
        }

        // Handle new geolocation fields
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            Point point = GeoUtils.createPoint(dto.getLatitude(), dto.getLongitude());
            currentUser.setCoordinates(point);
        }

        if (dto.getMaxMatchRadius() != null) {
            currentUser.setMaxMatchRadius(dto.getMaxMatchRadius());
        }

        userRepository.save(currentUser);
    }

    public void updateProfilePicture(Long id, String profilePicture) {
        if (profilePicture == null || profilePicture.trim().isEmpty()) {
            throw new IllegalArgumentException("Profile picture URL cannot be empty.");
        }

        User currentUser = getUserById(id);
        currentUser.setProfilePicture(profilePicture);
        userRepository.save(currentUser);
    }

    // Update a user's location with coordinates
    public void updateUserLocation(Long userId, LocationUpdateDTO locationData) {
        User user = getUserById(userId);

        // Update text location if provided
        if (locationData.location() != null && !locationData.location().trim().isEmpty()) {
            user.setLocation(locationData.location());
        }

        // Update coordinates if both lat and long are provided
        if (locationData.latitude() != null && locationData.longitude() != null) {
            Point point = GeoUtils.createPoint(locationData.latitude(), locationData.longitude());
            user.setCoordinates(point);
        }

        // Update max match radius if provided
        if (locationData.maxMatchRadius() != null) {
            user.setMaxMatchRadius(locationData.maxMatchRadius());
        }

        userRepository.save(user);
    }

    public boolean validate(String token) {
        String email = jwtService.extractUserName(token);
        UserDetails userdetails = userDetailsService.loadUserByUsername(email);
        return jwtService.validateToken(token, userdetails);
    }
}
