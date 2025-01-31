package com.app.matchme.controllers;

import com.app.matchme.entities.Users;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
