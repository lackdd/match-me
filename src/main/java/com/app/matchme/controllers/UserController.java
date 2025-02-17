package com.app.matchme.controllers;

import com.app.matchme.entities.Users;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin

public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/register")
    public Users register(@RequestBody Users user){
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody Users user){
        return service.verify(user);
    }

    @PostMapping("/validateToken")
    public ResponseEntity<?> validate(@RequestHeader(value = "Authorization", required = false) String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: Missing or incorrect format");
        }
        String token = authHeader.substring(7);
        boolean isValid = service.validate(token);
        if (isValid) {
            System.out.println("Token is valid");
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
    }

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<Users> getUsers() {
        return userRepository.findAll();
    }

    /*@GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return user.findById(id).orElseThrow(RuntimeException::new);
    }*/

    /*@GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request){
        return (CsrfToken) request.getAttribute("_csrf");
    }*/

    /*@PostMapping
    public ResponseEntity createUser(@RequestBody User user) throws URISyntaxException {
        User savedUser = user.save(user);
        return ResponseEntity.created(new URI("/users/" + savedUser.getId())).body(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity updateUser(@PathVariable Long id, @RequestBody User user) {
        User currentUser = user.findById(id).orElseThrow(RuntimeException::new);
        currentUser.setEmail(user.getEmail());
        currentUser.setPassword(user.getPassword());
        currentUser = user.save(user);

        return ResponseEntity.ok(currentUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteUser(@PathVariable Long id) {
        user.deleteById(id);
        return ResponseEntity.ok().build();
    }*/
}
