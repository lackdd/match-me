package com.app.matchme.controllers;

import com.app.matchme.entities.BioDTO;
import com.app.matchme.entities.ProfileDTO;
import com.app.matchme.entities.UsernamePictureDTO;
import com.app.matchme.entities.User;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.services.JWTService;
import com.app.matchme.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
/*@CrossOrigin(origins = "http://localhost:5173")*/

public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private JWTService jwtService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @GetMapping("/likedUsers")
    public ResponseEntity<?> getLikedUsersById(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, fetching liked user id's");
            Long id = service.extractUserId(token);
            List<Long> likedUsers = service.getLikedUsersById(id);
            return ResponseEntity.ok(likedUsers);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/pendingRequests")
    public ResponseEntity<?> getPendingRequests(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, fetching pending requests");
            Long id = service.extractUserId(token);
            List<Long> pendingRequests = service.getPendingRequestsById(id);
            return ResponseEntity.ok(pendingRequests);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/swiped")
    public ResponseEntity<?> swiped(@RequestHeader(value = "Authorization", required = false) String authHeader, @RequestParam("matchId") Long matchId, @RequestParam("swipedRight") boolean swipedRight) {
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, adding user id to liked users list");
            Long id = service.extractUserId(token);
            User currentUser = service.getUserById(id);
            User likedUser = service.getUserById(matchId);
            if(swipedRight) {
                try {
                    service.addLikedUserById(matchId, currentUser);
                    service.addPendingRequestById(id, likedUser);
                    service.addToSwipedUsers(matchId, currentUser);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "User id added to liked user list");
                    return ResponseEntity.ok(response);
                } catch (ResponseStatusException e){
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
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/addConnection")
    public ResponseEntity<?> addConnection (@RequestHeader (value = "Authorization", required = false) String authHeader, @RequestParam("matchId") Long matchId) {
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, adding connection to user");
            Long id = service.extractUserId(token);
            User currentUser = service.getUserById(id);
            service.addConnectionById(matchId, currentUser);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Connection added");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/deleteConnection")
    public ResponseEntity<?> deleteConnection (@RequestHeader (value = "Authorization", required = false) String authHeader, @RequestParam("connectionId") Long connectionId) {
        String token = authHeader.substring(7);
        Long currentUserId = jwtService.extractUserId(token);
        User currentUser = service.getUserById(currentUserId);
        try {
            service.deleteConnectionById(connectionId, currentUser);
            return ResponseEntity.ok("Connection " + connectionId + " deleted.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of("error", e.getReason()));
        }
    }

    @DeleteMapping("/deletePendingRequest")
    public ResponseEntity<?> deletePendingRequest(@RequestHeader(value = "Authorization", required = false) String authHeader, @RequestParam("pendingRequestId") Long pendingRequestId) {
        String token = authHeader.substring(7);
        Long currentUserId = jwtService.extractUserId(token);
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


    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return service.verify(user);
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
    public ResponseEntity<?> getConnections(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, fetching /connections data");
            Long id = service.extractUserId(token);
            List<Long> connections = service.getUserConnectionsById(id);

            if (connections.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(connections);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, fetching /recommendations data");
            Long id = service.extractUserId(token);
            List<Long> recommendedUserIds = service.findMatches(id);

            if (recommendedUserIds.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(recommendedUserIds);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> validateUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid token: Missing or incorrect format");
        }
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, fetching /me data");
            // extract user details from token and send them to frontend
            Long id = service.extractUserId(token);
            Optional <UsernamePictureDTO> userOptional = service.getUserNameAndPictureById(id);

            return userOptional
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/me/profile")
    public ResponseEntity<?> validateUserProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: Missing or incorrect format");
        }
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, fetching /me/profile data");
            // extract user details from token and send them to frontend
            Long id = service.extractUserId(token);
            Optional <ProfileDTO> userOptional = service.getUserProfileById(id);

            return userOptional
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/me/bio")
    public ResponseEntity<?> validateUserBio(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: Missing or incorrect format");
        }
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid, fetching /me(bio data");
            // extract user details from token and send them to frontend
            Long id = service.extractUserId(token);
            Optional <BioDTO> userOptional = service.getUserBioById(id);

            return userOptional
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
    public ResponseEntity<List<UsernamePictureDTO>> getUsersByIds(@RequestHeader(value = "Authorization", required = false) String authHeader, @RequestBody List<Long> ids) {
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            List<UsernamePictureDTO> users = ids.stream()
                    .map(id -> service.getUserNameAndPictureById(id))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
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
