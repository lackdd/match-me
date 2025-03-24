package com.app.matchme.controllers;

import com.app.matchme.entities.*;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.services.JWTService;
import com.app.matchme.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
/*@CrossOrigin(origins = "http://localhost:5173")*/

public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    private UserService service;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @GetMapping("/likedUsers")
    public ResponseEntity<?> getLikedUsersById(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        Long id = userPrincipal.getId();
        /*service.extractUserId(token);*/
        List<Long> likedUsers = service.getLikedUsersById(id);
        return ResponseEntity.ok(likedUsers);
    }

    @GetMapping("/pendingRequests")
    public ResponseEntity<?> getPendingRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long id = userPrincipal.getId();
        List<Long> pendingRequests = service.getPendingRequestsById(id);
        return ResponseEntity.ok(pendingRequests);
    }

    @PostMapping("/swiped")
    public ResponseEntity<?> swiped(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("matchId") Long matchId, @RequestParam("swipedRight") boolean swipedRight) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long id = userPrincipal.getId();
        User currentUser = service.getUserById(id);
        User likedUser = service.getUserById(matchId);
        if (swipedRight) {
            try {
                service.addLikedUserById(matchId, currentUser);
                service.addPendingRequestById(id, likedUser);
                service.addToSwipedUsers(matchId, currentUser);
                Map<String, String> response = new HashMap<>();
                response.put("message", "User id added to liked user list");
                return ResponseEntity.ok(response);
            } catch (ResponseStatusException e) {
                return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
            }
        } else {
            try {
                service.addToSwipedUsers(matchId, currentUser);
                return ResponseEntity.ok(Map.of("message", "User swiped to left"));
            } catch (ResponseStatusException e) {
                return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
            }
        }
    }

    @PostMapping("/addConnection")
    public ResponseEntity<?> addConnection(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("matchId") Long matchId) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long id = userPrincipal.getId();
        User currentUser = service.getUserById(id);
        service.addConnectionById(matchId, currentUser);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Connection added");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/deleteConnection")
    public ResponseEntity<?> deleteConnection (@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("connectionId") Long connectionId) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }
        Long currentUserId = userPrincipal.getId();
        User currentUser = service.getUserById(currentUserId);
        try {
            service.deleteConnectionById(connectionId, currentUser);
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
        User currentUser = service.getUserById(currentUserId);
        try {
            service.deletePendingRequestById(pendingRequestId, currentUser);
            return ResponseEntity.ok("Pending Request " + pendingRequestId + " deleted.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        }
    }

    @PostMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean exists = service.checkEmail(email);
        return Collections.singletonMap("exists", exists);
    }

    @PostMapping("/validateToken")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid token: Missing or incorrect format");
        }
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid");
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
    }

    @GetMapping("/connections")
    public ResponseEntity<?> getConnections(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }
        Long id = userPrincipal.getId();
        List<Long> connections = service.getUserConnectionsById(id);

        if (connections.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }
            Long id = userPrincipal.getId();
            List<Long> recommendedUserIds = service.findMatches(id);
            if (recommendedUserIds.isEmpty()) {
                System.out.println("Recommendations empty");
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(recommendedUserIds);
    }

    @GetMapping("/me")
    public ResponseEntity<?> validateUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
        }
        Long id = userPrincipal.getId();
        Optional<UsernamePictureDTO> userOptional = service.getUserNameAndPictureById(id);
        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateProfilePicture(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Map<String, String> body) {
        String profilePicture = body.get("profilePicture");
        Long id = userPrincipal.getId();
        service.updateProfilePicture(id, profilePicture);
        return ResponseEntity.ok("Updated profile picture.");
    }

    @PatchMapping("/change-password")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        Long id = userPrincipal.getId();
        service.updatePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok("Password updated.");
    }

    @PatchMapping("/me/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ProfileDTO dto) {
        Long id = userPrincipal.getId();
        service.updateProfile(id, dto);
        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "updatedProfile", dto // Send the profile data back as JSON
        ));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<?> validateUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if(userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        Long id = userPrincipal.getId();
        Optional<ProfileDTO> userOptional = service.getUserProfileById(id);

        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/me/bio")
    public ResponseEntity<?> updateBio(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody BioDTO dto) {
        Long id = userPrincipal.getId();
        service.updateBio(id, dto);
        return ResponseEntity.ok("Bio updated");
    }

    @GetMapping("/me/bio")
    public ResponseEntity<?> validateUserBio(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }
        Long id = userPrincipal.getId();
        Optional<BioDTO> userOptional = service.getUserBioById(id);

        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/hello-backend")
    public ResponseEntity<String> helloFrontend(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message != null && !message.isEmpty()) {
            return ResponseEntity.ok(message);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Message cannot be empty");
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UsernamePictureDTO> getUserById(@PathVariable Long id) {
        Optional <UsernamePictureDTO> userOptional = service.getUserNameAndPictureById(id);

        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/getUsersByIds")
    public ResponseEntity<List<UsernamePictureDTO>> getUsersByIds(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody List<Long> ids) {
        List<UsernamePictureDTO> users = ids.stream()
                .map(id -> service.getUserNameAndPictureById(id))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}/profile")
    public ResponseEntity<ProfileDTO> getUserProfileById(@PathVariable Long id) {
        Optional <ProfileDTO> userOptional = service.getUserProfileById(id);

        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/users/{id}/bio")
    public ResponseEntity<BioDTO> getUserBioById(@PathVariable Long id) {
        Optional <BioDTO> userOptional = service.getUserBioById(id);

        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
