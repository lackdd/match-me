package com.app.matchme.controllers;

import com.app.matchme.dtos.*;
import com.app.matchme.dtos.apirequestdtos.*;
import com.app.matchme.entities.*;
import com.app.matchme.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Validated
@Slf4j

public class UserController {

    private final UserService userService;

    @PostMapping("/addConnection")
    public ResponseEntity<ApiResponse<Long>> addConnection(@Valid @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                     @RequestBody ConnectionRequest request) {
        userService.addConnectionById(request.matchId(), userService.getUserById(userPrincipal.getId()));
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>("Connection added", request.matchId()));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(@Valid @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                            @RequestBody PasswordChangeRequest request) {
        userService.updatePassword(userPrincipal.getId(), request.oldPassword(), request.newPassword());
        return ResponseEntity.ok(new ApiResponse<>("Password changed"));
    }

    @PostMapping("/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(@Valid @RequestBody CheckEmailRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Email checked", userService.checkEmail(request.email())));
    }

    @PostMapping("/check-password")
    public ResponseEntity<ApiResponse<Boolean>> checkPassword(@Valid @AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody PasswordCheckRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Password checked", userService.checkPassword(userPrincipal.getId(), request.password())));
    }

    @GetMapping("/connections")
    public ResponseEntity<ApiResponse<List<Long>>> getConnections(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(new ApiResponse<>("Connections fetched", userService.getUserConnectionsById(userPrincipal.getId())));
    }

    @DeleteMapping("/deleteConnection")
    public ResponseEntity<Void> deleteConnection (@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("connectionId") Long connectionId) {
            userService.deleteConnectionById(connectionId, userService.getUserById(userPrincipal.getId()));
            return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deletePendingRequest")
    public ResponseEntity<Void> deletePendingRequest(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam("pendingRequestId") Long pendingRequestId) {
            userService.deletePendingRequestById(pendingRequestId, userService.getUserById(userPrincipal.getId()));
            return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_SERVICE')")
    @PostMapping("/getUsersByIds")
    public ResponseEntity<ApiResponse<List<UsernamePictureDTO>>> getUsersByIds(@Valid @RequestBody UserIdsRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched users by IDs", request.ids().stream().map(userService::getUserNameAndPictureById).toList()));
    }

    @PostMapping("/hello-backend")
    public ResponseEntity<ApiResponse<String>> helloFrontend(@Valid @RequestBody HelloBackendRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Hello from backend", request.message()));
    }

    @GetMapping("/likedUsers")
    public ResponseEntity<ApiResponse<List<Long>>> getLikedUsersById(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched liked users by ID", userService.getLikedUsersById(userPrincipal.getId())));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UsernamePictureDTO>> getUsernameAndProfilePicture(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched username and profile picture", userService.getUserNameAndPictureById(userPrincipal.getId())));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateProfilePicture(@Valid @AuthenticationPrincipal UserPrincipal userPrincipal, ProfilePictureRequest request) {
        userService.updateProfilePicture(userPrincipal.getId(), request.profilePicture());
        return ResponseEntity.ok(new ApiResponse<>("Profile picture updated successfully"));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteProfilePicture(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        userService.deleteProfilePicture(userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/bio")
    public ResponseEntity<ApiResponse<BioDTO>> getUserBio(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched User Bio", userService.getUserBioById(userPrincipal.getId())));
    }

    @PatchMapping("/me/bio")
    public ResponseEntity<ApiResponse<Void>> updateBio(@Valid @AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody BioDTO request) {
        userService.updateBio(userPrincipal.getId(), request);
        return ResponseEntity.ok(new ApiResponse<>("Bio updated successfully"));
    }

    @PostMapping("/me/location")
    public ResponseEntity<ApiResponse<Void>> updateLocation(@Valid @AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody LocationRequest request) {
        userService.updateUserLocation(userPrincipal.getId(), request);
        return ResponseEntity.ok(new ApiResponse<>("Location updated successfully"));
    }

    @GetMapping("/me/profile")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<ProfileDTO>> getUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched User profile", userService.getUserProfileById(userPrincipal.getId())));
    }

    @PatchMapping("/me/profile")
    public ResponseEntity<ApiResponse<ProfileDTO>> updateProfile(@Valid @AuthenticationPrincipal UserPrincipal userPrincipal, @RequestBody ProfileDTO request) {
        userService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(new ApiResponse<>("Profile updated successfully", request));
    }

    @PreAuthorize("hasRole('ROLE_SERVICE')")
    @GetMapping("/nearby-users")
    public ResponseEntity<ApiResponse<List<Long>>> getNearbyUsers(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid LocationParamsRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched nearby users:", userService.findUsersWithinRadius(userPrincipal.getId(), request.radius())));
    }

    @GetMapping("/pendingRequests")
    public ResponseEntity<ApiResponse<List<Long>>> getPendingRequests(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched all pending requests", userService.getPendingRequestsById(userPrincipal.getId())));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<Long>>> getRecommendations(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Long> recommendations = userService.findMatches(userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse<>("Fetched recommendations", recommendations));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok(new ApiResponse<>("User account registered successfully"));
    }

    @PostMapping("/swiped")
    public ResponseEntity<ApiResponse<Void>> swiped(@AuthenticationPrincipal UserPrincipal userPrincipal, @Valid @RequestBody SwipeRequest request) {
        userService.swiped(userPrincipal.getId(), request.matchId(), request.swipedRight());
        return ResponseEntity.ok(new ApiResponse<>("User has been swiped"));
    }

    @PreAuthorize("hasRole('ROLE_SERVICE')")
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getUsers() { return ResponseEntity.ok(new ApiResponse<>("Fetched users", userService.getUsers())); }

    @PreAuthorize("hasRole('ROLE_SERVICE') or #id == authentication.principal.id")
    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UsernamePictureDTO>> getUserById(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched username, picture for current user", userService.getUserNameAndPictureById(id)));
    }

    @PreAuthorize("hasRole('ROLE_SERVICE') or #id == authentication.principal.id")
    @GetMapping("/users/{id}/bio")
    public ResponseEntity<ApiResponse<BioDTO>> getUserBioById(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched bio for specified user", userService.getUserBioById(id)));
    }

    @PreAuthorize("hasRole('ROLE_SERVICE') or #id == authentication.principal.id")
    @GetMapping("/users/{id}/profile")
    public ResponseEntity<ApiResponse<ProfileDTO>> getUserProfileById(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Fetched profile for specified user", userService.getUserProfileById(id)));
    }

    @PostMapping("/validateToken")
    public ResponseEntity<ApiResponse<Void>> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        userService.validate(authHeader.substring(7));
        return ResponseEntity.ok(new ApiResponse<>("Token is valid"));
    }
}
