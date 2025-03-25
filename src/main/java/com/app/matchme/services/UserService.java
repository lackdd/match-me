package com.app.matchme.services;

import com.app.matchme.entities.*;
import com.app.matchme.mappers.UserMapper;
import com.app.matchme.repositories.UserRepository;
import jakarta.transaction.Transactional;
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

    public Optional<UserDTO> getUserDTOById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toDTO);
    }

    @Transactional
    public boolean areUsersConnected(String sender, String receiver) {
        User senderUser = repo.findByUsername(sender).orElseThrow(() -> new RuntimeException("User not found"));
        Long senderId = senderUser.getId();
        User receiverUser = repo.findByUsername(receiver).orElseThrow(() -> new RuntimeException("User not found"));
        Long receiverId = receiverUser.getId();

        if(senderUser.getConnections().contains(receiverId) && receiverUser.getConnections().contains(senderId)) {
            System.out.println("Users are confirmed to be connected");
            return true;
        }
        System.out.println("Failed to confirm that users are connected");
        return false;
    }

    @Transactional
    public void deletePendingRequestById(Long pendingRequestId, User currentUser) {
        User otherUser = repo.findById(pendingRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if (currentUser.getPendingRequests().contains(pendingRequestId)) {
            currentUser.getPendingRequests().remove(pendingRequestId);
            if(otherUser != null && otherUser.getLikedUsers().contains(currentUser.getId())) {
                otherUser.getLikedUsers().remove(currentUser.getId());
            }
        }
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public void addToSwipedUsers(Long matchId, User currentUser) {
        if (!currentUser.getPendingRequests().contains(matchId)) {
            currentUser.getPendingRequests().add(matchId);
            repo.save(currentUser);
        }
    }

    public List<Long> findMatches(Long id) {
        List<User> users = repo.findAll();
        Optional<User> optionalUser = repo.findById(id);
        User currentUser = optionalUser.orElseThrow(() -> new RuntimeException("User not found"));
        String idealMatchLocation = currentUser.getIdealMatchLocation();

        System.out.println(currentUser.getLocation().substring(currentUser.getLocation().lastIndexOf(",") + 1).trim());

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

        Map<User, Integer> userPointsMap = users.stream()
                .filter(user -> !Objects.equals(user.getId(), currentUser.getId()))
                .filter(user -> !currentUser.getSwipedUsers().contains(user.getId()))
                .filter(user -> "anywhere".equals(currentUser.getIdealMatchLocation()) || ("same_city".equals(idealMatchLocation) && Objects.equals(user.getLocation(), currentUser.getLocation())) || "same_country".equals(idealMatchLocation) && Objects.equals(user.getLocation().substring(user.getLocation().lastIndexOf(",") + 1).trim(), currentUser.getLocation().substring(user.getLocation().lastIndexOf(",") + 1).trim()))
                .filter(user -> "any".equals(currentUser.getIdealMatchAge()) || (user.getAge() >= idealMatchAgeMin && user.getAge() <= idealMatchAgeMax))
                .filter(user -> "any".equals(currentUser.getIdealMatchGender()) || Objects.equals(user.getGender(), currentUser.getIdealMatchGender()))
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

        if (currentUser.getIdealMatchYearsOfExperience() == "any" || (experience >= idealMatchExperienceMin && experience <= idealMatchExperienceMax) ) {
            points++;
        }
        return points;
    }

    public Optional<UsernamePictureDTO> getUserNameAndPictureById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toUsernamePictureDTO);
    }

    public void updateProfilePicture(Long id, String profilePicture) {
        if(profilePicture == null || profilePicture.trim().isEmpty()) {
            throw new IllegalArgumentException("Profile picture URL cannot be empty.");
        }

        User currentUser = getUserById(id);
        currentUser.setProfilePicture(profilePicture);
        repo.save(currentUser);
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
        repo.save(currentUser);
    }

    public void updateProfile(Long id, ProfileDTO dto ) {
        User currentUser = getUserById(id);
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
        repo.save(currentUser);
    }

    public void updatePassword(Long id, String oldPassword, String newPassword) {
        User currentUser = getUserById(id);
        if (!encoder.matches(oldPassword, currentUser.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect.");
        }

        if(newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty.");
        }

        currentUser.setPassword(encoder.encode(newPassword));
        repo.save(currentUser);
    }

    public Optional<ProfileDTO> getUserProfileById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toProfileDTO);
    }

    public Optional<BioDTO> getUserBioById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toBioDTO);
    }

    public List<Long> getUserConnectionsById(Long id) {
        return repo.findUserConnectionsById(id);
    }

    public void addLikedUserById(Long id, User currentUser) {
        if (!currentUser.getLikedUsers().contains(id)) {
            currentUser.getLikedUsers().add(id);
            repo.save(currentUser);
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User already in list");
        }
    }

    public void addPendingRequestById(Long id, User likedUser) {
        if (!likedUser.getPendingRequests().contains(id)) {
            likedUser.getPendingRequests().add(id);
            repo.save(likedUser);
        }
    }

    public List<Long> getLikedUsersById(Long id) { return repo.findUserLikedUsersById(id); }

    public User findByUsername(String username) {
        return repo.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Long> getPendingRequestsById(Long id) {return repo.findUserPendingRequestsById(id);}

    public void addConnectionById(Long id, User currentUser) {
        currentUser.getConnections().add(id);
        repo.save(currentUser);
    }

    @Transactional
    public void deleteConnectionById(Long connectionId, User currentUser) {
        User connectedUser = repo.findById(connectionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        if(currentUser.getConnections().contains(connectionId) && connectedUser.getConnections().contains(currentUser.getId())) {
            currentUser.getConnections().remove(connectionId);
            connectedUser.getConnections().remove(currentUser.getId());
            repo.save(currentUser);
            repo.save(connectedUser);
        }
    }

    /*public String verify(User user) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            User authenticatedUser = repo.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return jwtService.generateToken(authenticatedUser);
        }

        return "fail";
    }*/
}
