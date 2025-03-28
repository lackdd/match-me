package com.app.matchme.config;

import com.app.matchme.services.JWTService;
import com.app.matchme.services.UserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String email = jwtService.extractUserName(token);

                if (email != null) {
                    var userDetails = userDetailsService.loadUserByUsername(email);
                    if (jwtService.validateToken(token, userDetails)) {
                        var auth = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );

                        accessor.setUser(auth);
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        accessor.getSessionAttributes().put("user", auth);
                    }
                }
            }
        } else if (accessor != null && accessor.getUser() == null) {
            // for non-CONNECT commands, retrieve the authentication from session attributes
            if (accessor.getSessionAttributes() != null && accessor.getSessionAttributes().containsKey("user")) {
                accessor.setUser((UsernamePasswordAuthenticationToken) accessor.getSessionAttributes().get("user"));
            }
        }

        return message;
    }
}
