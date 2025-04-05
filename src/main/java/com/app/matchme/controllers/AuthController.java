package com.app.matchme.controllers;

import com.app.matchme.dtos.ApiResponse;
import com.app.matchme.dtos.apirequestdtos.LoginRequest;
import com.app.matchme.services.CustomUserDetailsService;
import com.app.matchme.services.JWTService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.service.secret-key}")
    private String serviceSecretKey;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> authenticateUser(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Add the second parameter "USER" to specify the role
        String jwt = jwtService.generateToken((UserDetails) authentication.getPrincipal(), "USER");
        return ResponseEntity.ok(new ApiResponse<>("Fetched token", jwt));
    }

    @PostMapping("/service-token")
    public ResponseEntity<ApiResponse<String>> generateServiceToken(
            @RequestHeader("X-Service-Key") String serviceKey,
            @RequestBody ServiceTokenRequest request) {
        log.info("Backend service key: " + serviceSecretKey);
        log.info("Frontend service key: " + serviceKey);
        // Validate the service key
        if (!serviceKey.equals(serviceSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid service key");
        }

        // Create a service user without looking it up in the database
        UserDetails serviceAccount = User.withUsername("service@app.com")
                .password("not-used")
                .roles("SERVICE")
                .build();

        try {
            String serviceToken = jwtService.generateToken(serviceAccount, "SERVICE");
            log.info("Generated service token with role: SERVICE");
            return ResponseEntity.ok(new ApiResponse<>("Service token generated", serviceToken));
        } catch (Exception e) {
            log.error("Error generating service token: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating service token");
        }
    }

    record ServiceTokenRequest(String email) {}
}
