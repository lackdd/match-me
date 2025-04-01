package com.app.matchme.controllers;

import com.app.matchme.dtos.*;
import com.app.matchme.entities.*;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/addConnection")
    public ResponseEntity<?> addConnection(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("matchId") Long matchId) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long id = userPrincipal.getId();
        User currentUser = userService.getUserById(id);
        userService.addConnectionById(matchId, currentUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Connection added");
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/change-password")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        Long id = userPrincipal.getId();
        userService.updatePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok("Password updated.");
    }

    @PostMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean exists = userService.checkEmail(email);
        return Collections.singletonMap("exists", exists);
    }

    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Map<String, String> body) {
        String password = body.get("password");
        Long id = userPrincipal.getId();
        boolean isCorrect = userService.checkPassword(id, password);
        if(isCorrect) {
            return ResponseEntity.ok("Password matches.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid password, password doesn't match.");
        }
    }

    @GetMapping("/connections")
    public ResponseEntity<?> getConnections(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }
        Long id = userPrincipal.getId();
        List<Long> connections = userService.getUserConnectionsById(id);

        if (connections.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(connections);
    }

    @DeleteMapping("/deleteConnection")
    public ResponseEntity<?> deleteConnection (@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("connectionId") Long connectionId) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long currentUserId = userPrincipal.getId();
        User currentUser = userService.getUserById(currentUserId);
        try {
            userService.deleteConnectionById(connectionId, currentUser);
            return ResponseEntity.ok("Connection " + connectionId + " deleted.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        }
    }

    @DeleteMapping("/deletePendingRequest")
    public ResponseEntity<?> deletePendingRequest(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("pendingRequestId") Long pendingRequestId) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long currentUserId = userPrincipal.getId();
        User currentUser = userService.getUserById(currentUserId);
        try {
            userService.deletePendingRequestById(pendingRequestId, currentUser);
            return ResponseEntity.ok("Pending Request " + pendingRequestId + " deleted.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        }
    }

    @PostMapping("/getUsersByIds")
    public ResponseEntity<List<UsernamePictureDTO>> getUsersByIds(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody List<Long> ids) {
        List<UsernamePictureDTO> users = ids.stream()
                .map(id -> userService.getUserNameAndPictureById(id))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/hello-backend")
    public ResponseEntity<String> helloFrontend(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message != null && !message.isEmpty()) {
            return ResponseEntity.ok(message);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Message cannot be empty");
    }

    @GetMapping("/likedUsers")
    public ResponseEntity<?> getLikedUsersById(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        Long id = userPrincipal.getId();
        /*userService.extractUserId(token);*/
        List<Long> likedUsers = userService.getLikedUsersById(id);
        return ResponseEntity.ok(likedUsers);
    }

    @GetMapping("/me")
    public ResponseEntity<?> validateUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }
        Long id = userPrincipal.getId();
        UsernamePictureDTO usernamePictureDTO = userService.getUserNameAndPictureById(id);
        return ResponseEntity.ok(usernamePictureDTO);
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateProfilePicture(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Map<String, String> body) {
        String profilePicture = body.get("profilePicture");
        Long id = userPrincipal.getId();
        userService.updateProfilePicture(id, profilePicture);
        return ResponseEntity.ok("Updated profile picture.");
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteProfilePicture(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long id = userPrincipal.getId();
        userService.deleteProfilePicture(id);
        return ResponseEntity.ok("Profile picture deleted");
    }

    @GetMapping("/me/bio")
    public ResponseEntity<?> validateUserBio(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        Long id = userPrincipal.getId();
        BioDTO bioDTO = userService.getUserBioById(id);

        return ResponseEntity.ok(bioDTO);
    }

    @PatchMapping("/me/bio")
    public ResponseEntity<?> updateBio(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody BioDTO dto) {
        Long id = userPrincipal.getId();
        userService.updateBio(id, dto);
        return ResponseEntity.ok("Bio updated");
    }

    @PostMapping("/me/location")
    public ResponseEntity<?> updateLocation(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                            @RequestBody LocationUpdateDTO locationData) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        Long id = userPrincipal.getId();
        userService.updateUserLocation(id, locationData);

        return ResponseEntity.ok(Map.of(
                "message", "Location updated successfully",
                "updatedLocation", locationData
        ));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<?> validateUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        Long id = userPrincipal.getId();
        ProfileDTO profileDTO = userService.getUserProfileById(id);

        return ResponseEntity.ok(profileDTO);
    }

    @PatchMapping("/me/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ProfileDTO dto) {
        System.out.println(dto);
        Long id = userPrincipal.getId();
        System.out.println(id);
        userService.updateProfile(id, dto);
        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "updatedProfile", dto
        ));
    }

    @GetMapping("/nearby-users")
    public ResponseEntity<?> getNearbyUsers(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                            @RequestParam(value = "radius", defaultValue = "50") Integer radiusKm) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }

        Long id = userPrincipal.getId();
        User currentUser = userService.getUserById(id);

        if (currentUser.getCoordinates() == null) {
            return ResponseEntity.badRequest().body("User location not set");
        }

        // This would be a new method in your userService that just returns users within radius
        // without all the other matching criteria
        List<Long> nearbyUserIds = userService.findUsersWithinRadius(id, radiusKm);

        if (nearbyUserIds.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(nearbyUserIds);
    }

    @GetMapping("/pendingRequests")
    public ResponseEntity<?> getPendingRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long id = userPrincipal.getId();
        List<Long> pendingRequests = userService.getPendingRequestsById(id);
        return ResponseEntity.ok(pendingRequests);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }
        Long id = userPrincipal.getId();
        List<Long> recommendedUserIds = userService.findMatches(id);
        if (recommendedUserIds.isEmpty()) {
            System.out.println("Recommendations empty");
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(recommendedUserIds);
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/swiped")
    public ResponseEntity<?> swiped(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("matchId") Long matchId, @RequestParam("swipedRight") boolean swipedRight) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long id = userPrincipal.getId();
        User currentUser = userService.getUserById(id);
        User likedUser = userService.getUserById(matchId);
        if (swipedRight) {
            try {
                userService.addLikedUserById(matchId, currentUser);
                userService.addPendingRequestById(id, likedUser);
                userService.addToSwipedUsers(matchId, currentUser);
                Map<String, String> response = new HashMap<>();
                response.put("message", "User id added to liked user list");
                return ResponseEntity.ok(response);
            } catch (ResponseStatusException e) {
                return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
            }
        } else {
            try {
                userService.addToSwipedUsers(matchId, currentUser);
                return ResponseEntity.ok(Map.of("message", "User swiped to left"));
            } catch (ResponseStatusException e) {
                return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
            }
        }
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UsernamePictureDTO> getUserById(@PathVariable Long id) {
        UsernamePictureDTO usernamePictureDTO = userService.getUserNameAndPictureById(id);

        return ResponseEntity.ok(usernamePictureDTO);
    }

    @GetMapping("/users/{id}/bio")
    public ResponseEntity<BioDTO> getUserBioById(@PathVariable Long id) {
        BioDTO bioDTO = userService.getUserBioById(id);

        return ResponseEntity.ok(bioDTO);
    }

    @GetMapping("/users/{id}/profile")
    public ResponseEntity<ProfileDTO> getUserProfileById(@PathVariable Long id) {
        ProfileDTO profileDTO = userService.getUserProfileById(id);

        return ResponseEntity.ok(profileDTO);
    }

    @PostMapping("/validateToken")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid token: Missing or incorrect format");
        }
        String token = authHeader.substring(7);
        boolean isValid = userService.validate(token);
        if (isValid) {
            System.out.println("Token is valid");
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
    }
}
