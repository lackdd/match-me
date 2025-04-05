package com.app.matchme.services;

import com.app.matchme.dtos.UserPrincipal;
import com.app.matchme.exceptions.BusinessException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JWTService {

    @Value("${app.service.secret-key}")
    private String serviceSecretKey;

    private final String userSecretKey;

    public JWTService() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            userSecretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new BusinessException("Failed to generate a secret key", e);
        }
    }

    public String generateToken(UserDetails userDetails, String role) {
        Map<String, Object> claims = new HashMap<>();

        if (userDetails instanceof UserPrincipal userPrincipal) {
            claims.put("id", userPrincipal.getUser().getId());
        }

        claims.put("role", role);

        boolean isServiceToken = "SERVICE".equals(role);

        return Jwts.builder().claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(isServiceToken ? getServiceKey() : getUserKey())
                .compact();
    }

    // Add method to get the user key
    private SecretKey getUserKey() {
        byte[] keyBytes = Decoders.BASE64.decode(userSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Modify to get the service key
    private SecretKey getServiceKey() {
        // Decode from Base64
        byte[] keyBytes = Base64.getDecoder().decode(serviceSecretKey);
        // Ensure key is at least 256 bits
        if (keyBytes.length < 32) {
            throw new BusinessException("Service key is too weak - must be at least 256 bits");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Use in place of current getKey() method
    // This method has an issue
//    private SecretKey getKey(String token) {
//        try {
//            // This won't work correctly for JWS tokens
//            Claims claims = Jwts.parser()
//                    .unsecured()
//                    .build().parseUnsecuredClaims(token.substring(0, token.lastIndexOf('.') + 1))
//                    .getPayload();
//
//            String role = claims.get("role", String.class);
//            return "SERVICE".equals(role) ? getServiceKey() : getUserKey();
//        } catch (Exception e) {
//            log.error("Error determining key type: {}", e.getMessage());
//            // Default to user key if we can't determine
//            return getUserKey();
//        }
//    }

    private SecretKey getKey(String token) {
        try {
            // First, get the header to check the algorithm
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                throw new JwtException("Invalid token format");
            }

            // Decode the header (first part)
            String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
            // You may need to use a JSON parser here to extract the algorithm

            // For simplicity, since we know we need a key for HS256
            SecretKey userKey = getUserKey();

            // Try to parse with user key first to check roles
            try {
                Claims claims = Jwts.parser()
                        .verifyWith(userKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String role = claims.get("role", String.class);
                return "SERVICE".equals(role) ? getServiceKey() : userKey;
            } catch (JwtException e) {
                // If user key fails, try service key
                return getServiceKey();
            }
        } catch (Exception e) {
            log.error("Error determining key type: {}", e.getMessage());
            // Default to user key if we can't determine
            return getUserKey();
        }
    }

    // Update existing methods to use the correct key
    public String extractUserName(String token) {
        if (token == null || token.trim().isEmpty()) {
            log.error("Token is missing or empty!");
            return null;
        }

        try {
            // Try with user key first
            return Jwts.parser()
                    .verifyWith(getUserKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (Exception e) {
            // If that fails, try with service key
            try {
                return Jwts.parser()
                        .verifyWith(getServiceKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getSubject();
            } catch (Exception ex) {
                log.error("Invalid token: {}", ex.getMessage());
                return null;
            }
        }
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String extractRole(String token) {
        try {
            // Try with user key first
            return Jwts.parser()
                    .verifyWith(getUserKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("role", String.class);
        } catch (Exception e) {
            // If that fails, try with service key
            try {
                return Jwts.parser()
                        .verifyWith(getServiceKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .get("role", String.class);
            } catch (Exception ex) {
                log.error("Error extracting role: {}", ex.getMessage());
                return null;
            }
        }
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey(token))  // Use the correct key based on token type
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Update validation method
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String userName = extractUserName(token);
            return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }
}
