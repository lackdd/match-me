package com.app.matchme.config;

import com.app.matchme.services.CustomUserDetailsService;
import com.app.matchme.services.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {
    private final JWTService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractTokenFromHeader(request);

        if (token != null) {
            authenticateWithToken(token, request);
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private void authenticateWithToken(String token, HttpServletRequest request) {
        String email = jwtService.extractUserName(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            String role = jwtService.extractRole(token);
            log.debug("Request to: {}, extracted email: {}, extracted role: {}",
                    request.getRequestURI(), email, role);

            if (email.equals("service@app.com")) {
                authenticateServiceUser(request);
            } else {
                authenticateRegularUser(email, token, role, request);
            }
        }
    }

    private void authenticateServiceUser(HttpServletRequest request) {
        List<SimpleGrantedAuthority> authorities =
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_SERVICE"));

        UserDetails serviceUser = org.springframework.security.core.userdetails.User
                .withUsername("service@app.com")
                .password("not-used")
                .authorities(authorities)
                .build();

        setAuthentication(serviceUser, authorities, request);
    }

    private void authenticateRegularUser(String email, String token, String role, HttpServletRequest request) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (jwtService.validateToken(token, userDetails)) {
            List<SimpleGrantedAuthority> authorities =
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + (role != null ? role : "USER")));

            setAuthentication(userDetails, authorities, request);
        }
    }

    private void setAuthentication(UserDetails userDetails, List<SimpleGrantedAuthority> authorities, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
