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

import java.util.Optional;

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

    public Optional<UserDTO> getUserById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toDTO);
    }

    public Optional<UsernamePictureDTO> getUserNameAndPictureById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toUsernamePictureDTO);
    }

    public Optional<UsernamePictureDTO> getUserNameAndPictureByEmail(String email) {
        return repo.findByEmail(email)
                .map(UserMapper::toUsernamePictureDTO);
    }

    public Optional<ProfileDTO> getUserProfileById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toProfileDTO);
    }

    public Optional<BioDTO> getUserBioById(Long id) {
        return repo.findById(id)
                .map(UserMapper::toBioDTO);
    }

    public String verify(User user) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (authentication.isAuthenticated())
            return jwtService.generateToken(user.getEmail());

        return "fail";
    }
}
