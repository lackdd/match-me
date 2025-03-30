package com.app.matchme.controllers;

import com.app.matchme.dtos.NotificationDTO;
import com.app.matchme.dtos.StatusMessage;
import com.app.matchme.dtos.StatusResponse;
import com.app.matchme.entities.ChatMessage;
import com.app.matchme.entities.ChatMessageDTO;
import com.app.matchme.entities.UnreadMessage;
import com.app.matchme.entities.User;
import com.app.matchme.entities.UserPrincipal;
import com.app.matchme.mappers.ChatMessageMapper;
import com.app.matchme.repositories.ChatMessageRepository;
import com.app.matchme.repositories.UnreadMessageRepository;
import com.app.matchme.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatMessageRepository repo;

    @Autowired
    private UnreadMessageRepository unreadMessageRepository;

    // Store user status in memory
    private static final Map<Long, Status> userStatusMap = new ConcurrentHashMap<>();

    // Store last heartbeat timestamp for each user
    private static final Map<Long, Long> userLastHeartbeat = new ConcurrentHashMap<>();

    // Store WebSocket session IDs linked to user IDs
    private static final Map<String, Long> sessionUserMap = new ConcurrentHashMap<>();

    public enum Status {
        JOIN,
        TYPING,
        IDLE,
        ACTIVE,
        INACTIVE,
        LEAVE
    }

    @GetMapping("/history/{userId}")
    public List<ChatMessageDTO> getChatHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long userId,
            @RequestParam(defaultValue= "20") int limit,
            @RequestParam(required = false) Long beforeId
    ) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        Long currentUserId = userPrincipal.getId();
        Pageable pageable = PageRequest.of(0, limit, Sort.by("id").descending());

        List<ChatMessage> messages = repo.findChatMessages(currentUserId, userId, beforeId, pageable);

        Collections.reverse(messages);

        return messages.stream()
                .map(ChatMessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/notifications")
    public List<NotificationDTO> getUserNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        Long userId = userPrincipal.getId();
        User currentUser = userService.getUserById(userId);

        // Get senders with unread messages
        List<Long> senderIds = unreadMessageRepository.findDistinctSendersWithUnreadMessages(userId);
        List<NotificationDTO> notifications = new ArrayList<>();

        for (Long senderId : senderIds) {
            User sender = userService.getUserById(senderId);
            long count = unreadMessageRepository.countUnreadMessagesFromSender(userId, senderId);

            // Get the latest unread message
            List<UnreadMessage> unreadMessages = unreadMessageRepository.findByUserAndReadFalseOrderByMessageTimestampDesc(currentUser)
                    .stream()
                    .filter(um -> um.getSender().getId().equals(senderId))
                    .collect(Collectors.toList());

            if (!unreadMessages.isEmpty()) {
                UnreadMessage latestUnread = unreadMessages.get(0);
                ChatMessage latestMessage = latestUnread.getMessage();

                // Create a message preview (first 30 chars)
                String preview = latestMessage.getContent();
                if (preview.length() > 30) {
                    preview = preview.substring(0, 27) + "...";
                }

                NotificationDTO notification = new NotificationDTO(
                        senderId,
                        sender.getUsername(),
                        latestMessage.getId(),
                        preview,
                        count,
                        latestMessage.getTimestamp()
                );

                notifications.add(notification);
            }
        }

        // Sort by most recent message
        notifications.sort((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()));

        return notifications;
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        Long userId = userPrincipal.getId();
        long count = unreadMessageRepository.countUnreadMessagesForUser(userId);

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);

        return response;
    }

    @PostMapping("/mark-as-read/{senderId}")
    @Transactional
    public void markMessagesAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long senderId
    ) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        Long userId = userPrincipal.getId();
        unreadMessageRepository.markMessagesAsRead(userId, senderId);
    }

    // Endpoint to explicitly set a user's status to INACTIVE/offline
    @PostMapping("/status/offline/{userId}")
    public void setUserOffline(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long userId
    ) {
        if (userPrincipal == null || !userPrincipal.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated or not authorized");
        }

        // Update user status to INACTIVE
        userStatusMap.put(userId, Status.INACTIVE);

        // Broadcast status to all connections
        User user = userService.getUserById(userId);
        List<Long> connections = user.getConnections();

        StatusResponse response = new StatusResponse(
                userId,
                user.getUsername(),
                Status.INACTIVE
        );

        for (Long connectionId : connections) {
            User connection = userService.getUserById(connectionId);
            if (connection != null) {
                messagingTemplate.convertAndSendToUser(
                        connection.getUsername().trim().replace(" ", "_"),
                        "/queue/status",
                        response
                );
                System.out.println("Sent OFFLINE status update about " + user.getUsername() + " to " + connection.getUsername());
            }
        }
    }

    // Get a user's current status
    @GetMapping("/status/{userId}")
    public StatusResponse getUserStatus(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long userId
    ) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }

        User user = userService.getUserById(userId);
        Status status = userStatusMap.getOrDefault(userId, Status.INACTIVE);

        return new StatusResponse(
                userId,
                user.getUsername(),
                status
        );
    }

    @MessageMapping("/status")
    public void handleStatusupdate(SimpMessageHeaderAccessor headerAccessor, @Payload StatusMessage statusMessage) {
        Principal principal = headerAccessor.getUser();

        if(principal == null) {
            System.out.println("Status update blocked: User not authenticated.");
            return;
        }

        String email = principal.getName();
        User sender = userService.getUserByEmail(email);
        User receiver = userService.getUserById(statusMessage.getReceiverId());
        String senderUsername = sender.getUsername();
        String receiverUsername = receiver.getUsername();

        // Update status in the map
        Status status = statusMessage.getStatus();
        userStatusMap.put(sender.getId(), status);

        // If status is ACTIVE, update the heartbeat timestamp
        if (status == Status.ACTIVE) {
            userLastHeartbeat.put(sender.getId(), System.currentTimeMillis());
        }

        // Store session ID for this user
        String sessionId = headerAccessor.getSessionId();
        if (sessionId != null) {
            sessionUserMap.put(sessionId, sender.getId());
            System.out.println("Associated session " + sessionId + " with user " + sender.getId());
        }

        System.out.println("Updated status for user " + sender.getId() + " to " + status);

        StatusResponse response = new StatusResponse(
                sender.getId(),
                senderUsername,
                status
        );

        System.out.println("Status update from " + senderUsername + " to " + receiverUsername + ": " + status);

        messagingTemplate.convertAndSendToUser(
                receiverUsername.trim().replace(" ", "_"),
                "/queue/status",
                response
        );
    }

    // Global status update - broadcasts to all connections
    @MessageMapping("/status/global")
    public void handleGlobalStatusUpdate(SimpMessageHeaderAccessor headerAccessor, @Payload StatusMessage statusMessage) {
        Principal principal = headerAccessor.getUser();

        if(principal == null) {
            System.out.println("Global status update blocked: User not authenticated.");
            return;
        }

        String email = principal.getName();
        User sender = userService.getUserByEmail(email);
        String senderUsername = sender.getUsername();

        // Update status in the map
        Status status = statusMessage.getStatus();
        userStatusMap.put(sender.getId(), status);

        // If status is ACTIVE, update the heartbeat timestamp
        if (status == Status.ACTIVE) {
            userLastHeartbeat.put(sender.getId(), System.currentTimeMillis());
        }

        System.out.println("Global status update for user " + sender.getId() + ": " + status);

        // Create status response
        StatusResponse response = new StatusResponse(
                sender.getId(),
                senderUsername,
                status
        );

        // Get all connections for this user
        List<Long> connections = sender.getConnections();

        // Send the status to all connections
        for (Long connectionId : connections) {
            User connection = userService.getUserById(connectionId);
            if (connection != null) {
                messagingTemplate.convertAndSendToUser(
                        connection.getUsername().trim().replace(" ", "_"),
                        "/queue/status",
                        response
                );
                System.out.println("Sent global " + status + " status from " + senderUsername + " to " + connection.getUsername());
            }
        }
    }

    // Request status updates from other users
    @MessageMapping("/status/request")
    public void requestStatusUpdate(SimpMessageHeaderAccessor headerAccessor, @Payload StatusMessage statusMessage) {
        Principal principal = headerAccessor.getUser();

        if(principal == null) {
            System.out.println("Status request blocked: User not authenticated.");
            return;
        }

        String email = principal.getName();
        User requester = userService.getUserByEmail(email);
        User target = userService.getUserById(statusMessage.getReceiverId());

        // Get the current status of the target user
        Status currentStatus = userStatusMap.getOrDefault(target.getId(), Status.INACTIVE);

        // Send the status back to the requester
        StatusResponse response = new StatusResponse(
                target.getId(),
                target.getUsername(),
                currentStatus
        );

        messagingTemplate.convertAndSendToUser(
                requester.getUsername().trim().replace(" ", "_"),
                "/queue/status",
                response
        );

        System.out.println("Sent status of " + target.getUsername() + " (" + currentStatus + ") to " + requester.getUsername());
    }

    // Handle heartbeat to keep track of active users - IMPROVED
    @MessageMapping("/heartbeat")
    public void handleHeartbeat(SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        if(principal == null) return;

        String email = principal.getName();
        User user = userService.getUserByEmail(email);
        if(user == null) return;

        // Update last heartbeat timestamp
        userLastHeartbeat.put(user.getId(), System.currentTimeMillis());

        // Always set user as ACTIVE when heartbeat is received
        userStatusMap.put(user.getId(), Status.ACTIVE);

        // Only broadcast if status changed from INACTIVE to ACTIVE
        if (userStatusMap.getOrDefault(user.getId(), Status.INACTIVE) != Status.ACTIVE) {
            // Broadcast the ACTIVE status to all connections
            StatusResponse response = new StatusResponse(
                    user.getId(),
                    user.getUsername(),
                    Status.ACTIVE
            );

            List<Long> connections = user.getConnections();
            for (Long connectionId : connections) {
                User connection = userService.getUserById(connectionId);
                if (connection != null) {
                    messagingTemplate.convertAndSendToUser(
                            connection.getUsername().trim().replace(" ", "_"),
                            "/queue/status",
                            response
                    );
                }
            }
        }
    }

    // Periodically check for inactive users - MODIFIED
    // Increase the inactivity timeout to avoid false offline statuses
    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    public void checkInactiveUsers() {
        long currentTime = System.currentTimeMillis();
        userLastHeartbeat.forEach((userId, timestamp) -> {
            // If no heartbeat in 10 minutes, consider user offline
            if (currentTime - timestamp > 600000) { // 10 minutes (increased from 2 minutes)
                // Only update if user is not already set to INACTIVE
                if (userStatusMap.getOrDefault(userId, Status.ACTIVE) != Status.INACTIVE) {
                    userStatusMap.put(userId, Status.INACTIVE);
                    System.out.println("User " + userId + " set to INACTIVE due to inactivity");

                    // Broadcast offline status to connections
                    User user = userService.getUserById(userId);
                    if (user != null) {
                        List<Long> connections = user.getConnections();

                        StatusResponse response = new StatusResponse(
                                userId,
                                user.getUsername(),
                                Status.INACTIVE
                        );

                        for (Long connectionId : connections) {
                            User connection = userService.getUserById(connectionId);
                            if (connection != null) {
                                messagingTemplate.convertAndSendToUser(
                                        connection.getUsername().trim().replace(" ", "_"),
                                        "/queue/status",
                                        response
                                );
                            }
                        }
                    }
                }

                // Remove from heartbeat map to avoid continuous processing
                userLastHeartbeat.remove(userId);
            }
        });
    }

    // Handle WebSocket session disconnect
    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        Long userId = sessionUserMap.remove(sessionId);

        if (userId != null) {
            // Check if this was the user's last active session
            boolean hasOtherActiveSessions = false;
            for (Long sessionUserId : sessionUserMap.values()) {
                if (sessionUserId.equals(userId)) {
                    hasOtherActiveSessions = true;
                    break;
                }
            }

            // Only set to INACTIVE if this was their last active session
            if (!hasOtherActiveSessions) {
                // Set user to INACTIVE
                userStatusMap.put(userId, Status.INACTIVE);

                // Broadcast status to connections
                User user = userService.getUserById(userId);
                if (user != null) {
                    System.out.println("User " + user.getUsername() + " disconnected, setting to INACTIVE");

                    StatusResponse response = new StatusResponse(
                            userId,
                            user.getUsername(),
                            Status.INACTIVE
                    );

                    List<Long> connections = user.getConnections();
                    for (Long connectionId : connections) {
                        User connection = userService.getUserById(connectionId);
                        if (connection != null) {
                            messagingTemplate.convertAndSendToUser(
                                    connection.getUsername().trim().replace(" ", "_"),
                                    "/queue/status",
                                    response
                            );
                        }
                    }
                }
            } else {
                System.out.println("User " + userId + " still has other active sessions, not marking as INACTIVE");
            }
        }
    }

    // Private message handling
    @MessageMapping("/private-message")
    public void sendPrivateMessage(SimpMessageHeaderAccessor headerAccessor, @Payload ChatMessageDTO messageDTO) {
        Principal principal = headerAccessor.getUser();

        if (principal == null) {
            System.out.println("Message blocked: User not authenticated.");
            return;
        }

        String email = principal.getName();
        System.out.println("Principal email: " + email);
        User sender = userService.getUserByEmail(email);
        User receiver = userService.getUserById(messageDTO.getReceiverId());
        String senderUsername = sender.getUsername();
        String receiverUsername = receiver.getUsername();

        if (!userService.areUsersConnected(senderUsername, receiverUsername)) {
            System.out.println("Message blocked: Users are not connected.");
            return;
        }

        ChatMessage chatMessage = new ChatMessage(sender, receiver, messageDTO.getContent());
        ChatMessage savedMessage = repo.save(chatMessage);

        // Track as unread message for receiver (only if they're not actively in the chat)
        UnreadMessage unreadMessage = new UnreadMessage(receiver, sender, savedMessage);
        unreadMessageRepository.save(unreadMessage);

        // Create notification for the unread message
        long unreadCount = unreadMessageRepository.countUnreadMessagesFromSender(receiver.getId(), sender.getId());
        NotificationDTO notification = new NotificationDTO(
                sender.getId(),
                senderUsername,
                savedMessage.getId(),
                messageDTO.getContent().length() > 30 ? messageDTO.getContent().substring(0, 27) + "..." : messageDTO.getContent(),
                unreadCount,
                savedMessage.getTimestamp()
        );

        ChatMessageDTO responseDTO = ChatMessageMapper.toDTO(savedMessage);

        System.out.println("Sending private message from " + senderUsername + " to " + receiverUsername + " Message content: " + messageDTO.getContent());

        // send message to receiver's private queue
        messagingTemplate.convertAndSendToUser(
                receiverUsername.trim().replace(" ", "_"),
                "/queue/messages",
                responseDTO
        );

        // Send notification about unread message
        messagingTemplate.convertAndSendToUser(
                receiverUsername.trim().replace(" ", "_"),
                "/queue/notifications",
                notification
        );

        messagingTemplate.convertAndSendToUser(
                senderUsername.trim().replace(" ", "_"),
                "/queue/messages",
                responseDTO
        );
        System.out.println("🚀 Message sent to /user/" + receiverUsername.trim().replace(" ", "_") + "/queue/messages");
    }
}
