package com.app.matchme.services;

import com.app.matchme.entities.User;
import com.app.matchme.dtos.UserPrincipal;
import com.app.matchme.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if (email.equals("service@app.com")) {
            return org.springframework.security.core.userdetails.User
                    .withUsername("service@app.com")
                    .password("not-used")
                    .roles("SERVICE")
                    .build();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new UserPrincipal(user);
    }
}
