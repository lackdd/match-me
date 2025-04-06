package com.app.matchme.services;

import com.app.matchme.dtos.BioDTO;
import com.app.matchme.dtos.apirequestdtos.LocationRequest;
import com.app.matchme.dtos.ProfileDTO;
import com.app.matchme.dtos.UsernamePictureDTO;
import com.app.matchme.dtos.apirequestdtos.RegisterRequest;
import com.app.matchme.entities.*;
import com.app.matchme.exceptions.BusinessException;
import com.app.matchme.exceptions.RepositoryException;
import com.app.matchme.mappers.UserMapper;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.utils.GeoUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final JWTService jwtService;
    private final CustomUserDetailsService userDetailsService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    private static final String USER_NOT_FOUND = "User not found";
    private static final String NEARBY_USERS_NOT_FOUND = "Nearby users not found";
    private static final String SAME_CITY = "same_city";

    public void addConnectionById(Long id, User currentUser) {
        if (!currentUser.getPendingRequests().contains(id)) {
            throw new BusinessException("You don't have this user in your pending request list");
        }
        User likedUser = getUserById(id);
        currentUser.getConnections().add(id);
        likedUser.getConnections().add(currentUser.getId());
        userRepository.save(currentUser);
        userRepository.save(likedUser);
    }

    public void addLikedUserById(Long id, User currentUser) {
        log.info("inside addlikeduserby id line 5");
        if (currentUser.getLikedUsers().contains(id)) {
            throw new BusinessException("User already in list");
        }
        log.info("inside addlikeduserby id line 6");
        currentUser.getLikedUsers().add(id);
        log.info("inside addlikeduserby id line 7");
        log.info("Currentuser: {}", currentUser);
        userRepository.save(currentUser);
        log.info("inside addlikeduserby id line 8");
    }

    public void addPendingRequestById(Long id, User likedUser) {
        if (likedUser.getPendingRequests().contains(id)) {
            throw new BusinessException("Pending request list already contains id");
        }
        likedUser.getPendingRequests().add(id);
        userRepository.save(likedUser);
    }

    public void addToSwipedUsers(Long matchId, User currentUser) {
        if (currentUser.getSwipedUsers().contains(matchId)) {
            throw new BusinessException("Swiped users list already contains id");
        }
        currentUser.getSwipedUsers().add(matchId);
        userRepository.save(currentUser);
    }

    @Transactional
    public boolean areUsersConnected(String sender, String receiver) {
        User senderUser = userRepository.findByUsername(sender).orElseThrow(() -> new RepositoryException(USER_NOT_FOUND));
        Long senderId = senderUser.getId();
        User receiverUser = userRepository.findByUsername(receiver).orElseThrow(() -> new RepositoryException(USER_NOT_FOUND));
        Long receiverId = receiverUser.getId();

        if (senderUser.getConnections().contains(receiverId) && receiverUser.getConnections().contains(senderId)) {
            log.info("Users are confirmed to be connected");
            return true;
        }
        throw new BusinessException("Failed to confirm that users are connected");
    }

    private int[] calculateIdealMatchAgeRange(String ageRange) {
        if (ageRange.equals("any")) {
            return new int[]{0, 150};
        }
        if (ageRange.contains("-")) {
            String[] parts = ageRange.split("-");
            if (parts.length == 2) {
                int min = Integer.parseInt(parts[0]);
                int max = Integer.parseInt(parts[1]);
                return new int[]{min, max};
            }
        }
        throw new BusinessException("Ideal match age not in bounds");
    }

    private int[] calculateExperienceRange(String experience) {
        if (experience.equals("any")) {
            return new int[]{0, 100};
        }

        if (experience.contains("-")) {
            String[] parts = experience.split("-");
            if (parts.length == 2) {
                int min = Integer.parseInt(parts[0]);
                int max = Integer.parseInt(parts[1]);
                return new int[]{min, max};
            }
        }

        throw new BusinessException("Ideal match uears of experience not in bounds");
    }

    public Integer calculatePoints(User user, User currentUser) {
        int points = 0;
        List<String> musicGenres = user.getPreferredMusicGenres();
        List<String> methods = user.getPreferredMethods();
        List<String> goals = user.getGoalsWithMusic();
        Integer experience = user.getYearsOfMusicExperience();
        int[] experienceRange = calculateExperienceRange(currentUser.getIdealMatchYearsOfExperience());
        int idealMatchExperienceMin = experienceRange[0];
        int idealMatchExperienceMax = experienceRange[1];

        Map<List<String>, List<String>> matchPairs = Map.of(
                musicGenres, currentUser.getIdealMatchGenres(),
                methods, currentUser.getIdealMatchMethods(),
                goals, currentUser.getIdealMatchGoals()
        );

        points += matchPairs.entrySet().stream()
                .mapToInt(entry -> countMatches(entry.getKey(), entry.getValue()))
                .sum();

        if (currentUser.getIdealMatchYearsOfExperience().equals("any") || (experience >= idealMatchExperienceMin && experience <= idealMatchExperienceMax)) {
            points++;
        }
        return points;
    }

    public boolean checkEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean checkPassword(Long id, String password) {
        return encoder.matches(password, getUserById(id).getPassword());
    }

    private int countMatches(List<String> userItems, List<String> preferredItems) {
        return (int) userItems.stream()
                .filter(preferredItems::contains)
                .count();
    }

    @Transactional
    public void deleteConnectionById(Long connectionId, User currentUser) {
        User connectedUser = userRepository.findById(connectionId).orElseThrow(() -> new RepositoryException(USER_NOT_FOUND));
        if (currentUser.getConnections().contains(connectionId) && connectedUser.getConnections().contains(currentUser.getId())) {
            currentUser.getConnections().remove(connectionId);
            connectedUser.getConnections().remove(currentUser.getId());
            userRepository.save(currentUser);
            userRepository.save(connectedUser);
        } else {
            throw new BusinessException("Couldn't delete connection");
        }
    }

    @Transactional
    public void deletePendingRequestById(Long pendingRequestId, User currentUser) {
        User otherUser = userRepository.findById(pendingRequestId).orElseThrow(() -> new RepositoryException("Other user not found"));
        if (currentUser.getPendingRequests().contains(pendingRequestId)) {
            currentUser.getPendingRequests().remove(pendingRequestId);
            if (otherUser != null) {
                otherUser.getLikedUsers().remove(currentUser.getId());
            }
        }
    }

    public void deleteProfilePicture(Long id) {
        User currentUser = getUserById(id);
        currentUser.setProfilePicture(null);
        userRepository.save(currentUser);
    }

    private String extractCountry(String location) {
        return location.substring(location.lastIndexOf(",") + 1).trim();
    }

    @Transactional
    public List<Long> findMatches(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        User currentUser = optionalUser.orElseThrow(() -> new RuntimeException(USER_NOT_FOUND));
        List<User> potentialMatches = findPotentialMatchesByLocation(currentUser);

        int[] ageRange = calculateIdealMatchAgeRange(currentUser.getIdealMatchAge());
        int idealMatchAgeMin = ageRange[0];
        int idealMatchAgeMax = ageRange[1];

        Map<User, Integer> userPointsMap = potentialMatches.stream()
                .filter(user -> !currentUser.getSwipedUsers().contains(user.getId()))
                .filter(user -> "any".equals(currentUser.getIdealMatchAge()) ||
                        (user.getAge() >= idealMatchAgeMin && user.getAge() <= idealMatchAgeMax))
                .filter(user -> "any".equals(currentUser.getIdealMatchGender()) ||
                        Objects.equals(user.getGender(), currentUser.getIdealMatchGender()))
                .collect(Collectors.toMap(user -> user, user -> calculatePoints(user, currentUser)));
        return userPointsMap.entrySet().stream()
                .sorted(Map.Entry.<User, Integer>comparingByValue().reversed()).limit(10)
                .map(entry -> entry.getKey().getId()).toList();
    }

    private List<User> findPotentialMatchesByLocation(User currentUser) {
        String idealMatchLocation = currentUser.getIdealMatchLocation();

        if (currentUser.getCoordinates() != null && currentUser.getMaxMatchRadius() != null && !"anywhere".equals(idealMatchLocation)) {
            return findMatchesWithCoordinates(currentUser, idealMatchLocation);
        } else {
            return findMatchesWithoutCoordinates(currentUser, idealMatchLocation);
        }
    }

    private List<User> findMatchesWithCoordinates(User currentUser, String idealMatchLocation) {
        Integer radiusInMeters = currentUser.getMaxMatchRadius() * 1000;
        List<User> potentialMatches;

        if (SAME_CITY.equals(idealMatchLocation) || "same_country".equals(idealMatchLocation)) {
            potentialMatches = userRepository.findUsersWithinRadius(
                            currentUser.getCoordinates().getY(),
                            currentUser.getCoordinates().getX(),
                            radiusInMeters,
                            currentUser.getId())
                    .orElseThrow(() -> new RepositoryException(NEARBY_USERS_NOT_FOUND));

            if (SAME_CITY.equals(idealMatchLocation)) {
                return potentialMatches.stream()
                        .filter(user -> Objects.equals(user.getLocation(), currentUser.getLocation()))
                        .toList();
            } else {
                return potentialMatches.stream()
                        .filter(user -> user.getLocation() != null && currentUser.getLocation() != null)
                        .filter(user -> Objects.equals(
                                extractCountry(user.getLocation()),
                                extractCountry(currentUser.getLocation())))
                        .toList();
            }
        } else {
            return userRepository.findUsersWithinRadius(
                            currentUser.getCoordinates().getY(),
                            currentUser.getCoordinates().getX(),
                            radiusInMeters,
                            currentUser.getId())
                    .orElseThrow(() -> new BusinessException(NEARBY_USERS_NOT_FOUND));
        }
    }

    private List<User> findMatchesWithoutCoordinates(User currentUser, String idealMatchLocation) {
        return userRepository.findAll().stream()
                .filter(user -> !Objects.equals(user.getId(), currentUser.getId()))
                .filter(user ->
                        "anywhere".equals(idealMatchLocation) ||
                                (SAME_CITY.equals(idealMatchLocation) &&
                                        Objects.equals(user.getLocation(), currentUser.getLocation())) ||
                                "same_country".equals(idealMatchLocation) &&
                                        user.getLocation() != null &&
                                        currentUser.getLocation() != null &&
                                        Objects.equals(
                                                extractCountry(user.getLocation()),
                                                extractCountry(currentUser.getLocation())
                                        )
                )
                .toList();
    }

    @Transactional
    public List<Long> findUsersWithinRadius(Long userId, Integer radiusKm) {
        User currentUser = getUserById(userId);
        if (currentUser.getCoordinates() == null) {
            throw new BusinessException("User location not set");
        }
        int radiusInMeters = radiusKm * 1000;
        List<User> nearbyUsers = userRepository.findUsersWithinRadius(currentUser.getCoordinates().getY(),
                currentUser.getCoordinates().getX(),
                radiusInMeters, userId).orElseThrow(() -> new RepositoryException(NEARBY_USERS_NOT_FOUND));

        return nearbyUsers.stream().map(User::getId).filter(id -> !id.equals(userId)).toList();
    }

    public List<Long> getLikedUsersById(Long id) {
        return userRepository.findUserLikedUsersById(id).orElseThrow(() -> new RepositoryException(USER_NOT_FOUND));
    }

    public List<Long> getPendingRequestsById(Long id) {
        return userRepository.findUserPendingRequestsById(id).orElseThrow(() -> new RepositoryException(USER_NOT_FOUND));
    }

    public BioDTO getUserBioById(Long id) {
        return userRepository.findById(id).map(UserMapper::toBioDTO).orElseThrow(() -> new RepositoryException(USER_NOT_FOUND));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RepositoryException(USER_NOT_FOUND));
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

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already exists.");
        }
        User currentUser = UserMapper.fromRegisterRequestToUser(request);
        currentUser.setPassword(encoder.encode(currentUser.getPassword()));
        userRepository.save(currentUser);
    }

    public void swiped(Long currentUserId, Long matchId, boolean swipedRight) {
        log.info("Is swipedRight not null: " + swipedRight);
        log.info("Is swipedRight not null: {}", swipedRight);
        System.out.println(swipedRight);
        User currentUser = getUserById(currentUserId);
        if (swipedRight) {
            log.info("Got inside swipedRight line 1");
            addLikedUserById(matchId, currentUser);
            log.info("Got inside swipedRight line 2");
            addPendingRequestById(currentUserId, getUserById(matchId));
            log.info("Got inside swipedRight line 3");
            addToSwipedUsers(matchId, currentUser);
            log.info("Got inside swipedRight line 4");
        } else {
            addToSwipedUsers(matchId, currentUser);
        }
    }

    public void updateBio(Long id, BioDTO dto) {
        User currentUser = getUserById(id);
        UserMapper.fromBioDTOtoUser(currentUser, dto);
        userRepository.save(currentUser);
    }

    public void updatePassword(Long id, String oldPassword, String newPassword) {
        User currentUser = getUserById(id);
        if (!encoder.matches(oldPassword, currentUser.getPassword())) {
            throw new BusinessException("Old password is incorrect.");
        }
        currentUser.setPassword(encoder.encode(newPassword));
        userRepository.save(currentUser);
    }

    public void updateProfile(Long id, ProfileDTO dto) {
        User currentUser = getUserById(id);
        UserMapper.fromProfileDTOtoUser(currentUser, dto);
        userRepository.save(currentUser);
    }

    public void updateProfilePicture(Long id, String profilePicture) {
        User currentUser = getUserById(id);
        currentUser.setProfilePicture(profilePicture);
        userRepository.save(currentUser);
    }

    public void updateUserLocation(Long userId, LocationRequest locationData) {
        User user = getUserById(userId);

        if (locationData.location() != null && !locationData.location().trim().isEmpty()) {
            user.setLocation(locationData.location());
        }

        if (locationData.latitude() != null && locationData.longitude() != null) {
            Point point = GeoUtils.createPoint(locationData.latitude(), locationData.longitude());
            user.setCoordinates(point);
        }

        if (locationData.maxMatchRadius() != null) {
            user.setMaxMatchRadius(locationData.maxMatchRadius());
        }
        userRepository.save(user);
    }

    public void validate(String token) {
        String email = jwtService.extractUserName(token);
        UserDetails userdetails = userDetailsService.loadUserByUsername(email);
        if (!jwtService.validateToken(token, userdetails)) {
            throw new BusinessException("Token is not valid");
        }
    }
}
