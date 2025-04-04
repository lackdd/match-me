package com.app.matchme.controllers;

import com.app.matchme.dtos.NotificationDTO;
import com.app.matchme.dtos.StatusMessage;
import com.app.matchme.dtos.StatusResponse;
import com.app.matchme.entities.ChatMessage;
import com.app.matchme.dtos.ChatMessageDTO;
import com.app.matchme.entities.UnreadMessage;
import com.app.matchme.entities.User;
import com.app.matchme.dtos.UserPrincipal;
import com.app.matchme.mappers.ChatMessageMapper;
import com.app.matchme.repositories.ChatMessageRepository;
import com.app.matchme.repositories.UnreadMessageRepository;
import com.app.matchme.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private static final String USER_NOT_AUTHENTICATED = "User is not authenticated";
    private static final String STATUS_QUEUE = "/queue/status";
    private static final String MESSAGES_QUEUE = "/queue/messages";
    private static final String NOTIFICATIONS_QUEUE = "/queue/notifications";
    private static final int MESSAGE_PREVIEW_LENGTH = 30;
    private static final int PREVIEW_TRUNCATE_LENGTH = 27;
    private static final long HEARTBEAT_CHECK_INTERVAL = 300000;
    private static final long INACTIVITY_TIMEOUT = 600000;

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final ChatMessageRepository chatMessageRepository;
    private final UnreadMessageRepository unreadMessageRepository;

    private static final Map<Long, Status> userStatusMap = new ConcurrentHashMap<>();
    private static final Map<Long, Long> userLastHeartbeat = new ConcurrentHashMap<>();
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
        validateUserAuthenticated(userPrincipal);

        Long currentUserId = userPrincipal.getId();
        Pageable pageable = PageRequest.of(0, limit, Sort.by("id").descending());
        List<ChatMessage> messages = chatMessageRepository.findChatMessages(currentUserId, userId, beforeId, pageable);

        Collections.reverse(messages);
        return messages.stream()
                .map(ChatMessageMapper::toDTO)
                .toList();
    }

    @GetMapping("/notifications")
    public List<NotificationDTO> getUserNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        validateUserAuthenticated(userPrincipal);

        Long userId = userPrincipal.getId();
        User currentUser = userService.getUserById(userId);

        List<Long> senderIds = unreadMessageRepository.findDistinctSendersWithUnreadMessages(userId);
        List<NotificationDTO> notifications = new ArrayList<>();

        for (Long senderId : senderIds) {
            addSenderNotification(currentUser, userId, senderId, notifications);
        }

        notifications.sort((a, b) -> b.lastMessageTime().compareTo(a.lastMessageTime()));
        return notifications;
    }

    private void addSenderNotification(User currentUser, Long userId, Long senderId, List<NotificationDTO> notifications) {
        User sender = userService.getUserById(senderId);
        long count = unreadMessageRepository.countUnreadMessagesFromSender(userId, senderId);

        List<UnreadMessage> unreadMessages = unreadMessageRepository.findByUserAndReadFalseOrderByMessageTimestampDesc(currentUser)
                .stream()
                .filter(um -> um.getSender().getId().equals(senderId))
                .toList();

        if (!unreadMessages.isEmpty()) {
            UnreadMessage latestUnread = unreadMessages.get(0);
            ChatMessage latestMessage = latestUnread.getMessage();
            String preview = createMessagePreview(latestMessage.getContent());

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

    private String createMessagePreview(String content) {
        if (content.length() > MESSAGE_PREVIEW_LENGTH) {
            return content.substring(0, PREVIEW_TRUNCATE_LENGTH) + "...";
        }
        return content;
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        validateUserAuthenticated(userPrincipal);

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
        validateUserAuthenticated(userPrincipal);

        Long userId = userPrincipal.getId();
        unreadMessageRepository.markMessagesAsRead(userId, senderId);
    }

    @PostMapping("/status/offline/{userId}")
    public void setUserOffline(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long userId
    ) {
        if (userPrincipal == null || !userPrincipal.getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, USER_NOT_AUTHENTICATED);
        }

        userStatusMap.put(userId, Status.INACTIVE);

        User user = userService.getUserById(userId);
        broadcastStatusToConnections(user, Status.INACTIVE);
    }

    @GetMapping("/status/{userId}")
    public StatusResponse getUserStatus(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long userId
    ) {
        validateUserAuthenticated(userPrincipal);

        User user = userService.getUserById(userId);
        Status status = userStatusMap.getOrDefault(userId, Status.INACTIVE);

        return new StatusResponse(
                userId,
                user.getUsername(),
                status
        );
    }

    @MessageMapping("/status")
    public void handleStatusUpdate(SimpMessageHeaderAccessor headerAccessor, @Payload StatusMessage statusMessage) {
        Principal principal = headerAccessor.getUser();

        if (principal == null) {
            log.error("Status update blocked: User not authenticated");
            return;
        }

        String email = principal.getName();
        User sender = userService.getUserByEmail(email);
        User receiver = userService.getUserById(statusMessage.receiverId());
        String senderUsername = sender.getUsername();
        String receiverUsername = receiver.getUsername();

        Status status = statusMessage.status();
        userStatusMap.put(sender.getId(), status);

        if (status == Status.ACTIVE) {
            userLastHeartbeat.put(sender.getId(), System.currentTimeMillis());
        }

        String sessionId = headerAccessor.getSessionId();
        if (sessionId != null) {
            sessionUserMap.put(sessionId, sender.getId());
        }

        StatusResponse response = new StatusResponse(
                sender.getId(),
                senderUsername,
                status
        );

        sendToUser(receiverUsername, STATUS_QUEUE, response);
    }

    @MessageMapping("/status/global")
    public void handleGlobalStatusUpdate(SimpMessageHeaderAccessor headerAccessor, @Payload StatusMessage statusMessage) {
        Principal principal = headerAccessor.getUser();

        if (principal == null) {
            log.error("Global status update blocked: User not authenticated");
            return;
        }

        String email = principal.getName();
        User sender = userService.getUserByEmail(email);

        Status status = statusMessage.status();
        userStatusMap.put(sender.getId(), status);

        if (status == Status.ACTIVE) {
            userLastHeartbeat.put(sender.getId(), System.currentTimeMillis());
        }

        broadcastStatusToConnections(sender, status);
    }

    @MessageMapping("/status/request")
    public void requestStatusUpdate(SimpMessageHeaderAccessor headerAccessor, @Payload StatusMessage statusMessage) {
        Principal principal = headerAccessor.getUser();

        if (principal == null) {
            log.error("Status request blocked: User not authenticated");
            return;
        }

        String email = principal.getName();
        User requester = userService.getUserByEmail(email);
        User target = userService.getUserById(statusMessage.receiverId());

        Status currentStatus = userStatusMap.getOrDefault(target.getId(), Status.INACTIVE);

        StatusResponse response = new StatusResponse(
                target.getId(),
                target.getUsername(),
                currentStatus
        );

        sendToUser(requester.getUsername(), STATUS_QUEUE, response);
    }

    @MessageMapping("/heartbeat")
    public void handleHeartbeat(SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        if (principal == null) return;

        String email = principal.getName();
        User user = userService.getUserByEmail(email);
        if (user == null) return;

        userLastHeartbeat.put(user.getId(), System.currentTimeMillis());

        Status previousStatus = userStatusMap.getOrDefault(user.getId(), Status.INACTIVE);
        userStatusMap.put(user.getId(), Status.ACTIVE);

        if (previousStatus != Status.ACTIVE) {
            broadcastStatusToConnections(user, Status.ACTIVE);
        }
    }

    @Scheduled(fixedRate = HEARTBEAT_CHECK_INTERVAL)
    public void checkInactiveUsers() {
        long currentTime = System.currentTimeMillis();
        userLastHeartbeat.forEach((userId, timestamp) -> {
            if (currentTime - timestamp > INACTIVITY_TIMEOUT) {
                if (userStatusMap.getOrDefault(userId, Status.ACTIVE) != Status.INACTIVE) {
                    userStatusMap.put(userId, Status.INACTIVE);

                    User user = userService.getUserById(userId);
                    if (user != null) {
                        broadcastStatusToConnections(user, Status.INACTIVE);
                    }
                }

                userLastHeartbeat.remove(userId);
            }
        });
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        Long userId = sessionUserMap.remove(sessionId);

        if (userId != null && !hasOtherActiveSessions(userId)) {
            userStatusMap.put(userId, Status.INACTIVE);

            User user = userService.getUserById(userId);
            if (user != null) {
                log.info("User {} disconnected, setting to INACTIVE", user.getUsername());
                broadcastStatusToConnections(user, Status.INACTIVE);
            }
        }
    }

    private boolean hasOtherActiveSessions(Long userId) {
        return sessionUserMap.values().stream().anyMatch(id -> id.equals(userId));
    }

    @MessageMapping("/private-message")
    public void sendPrivateMessage(SimpMessageHeaderAccessor headerAccessor, @Payload ChatMessageDTO messageDTO) {
        Principal principal = headerAccessor.getUser();

        if (principal == null) {
            log.error("Message blocked: User not authenticated");
            return;
        }

        String email = principal.getName();
        User sender = userService.getUserByEmail(email);
        User receiver = userService.getUserById(messageDTO.receiverId());
        String senderUsername = sender.getUsername();
        String receiverUsername = receiver.getUsername();

        if (!userService.areUsersConnected(senderUsername, receiverUsername)) {
            log.error("Message blocked: Users are not connected");
            return;
        }

        ChatMessage chatMessage = new ChatMessage(sender, receiver, messageDTO.content());
        ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

        saveUnreadMessage(sender, receiver, savedMessage);

        ChatMessageDTO responseDTO = ChatMessageMapper.toDTO(savedMessage);

        sendToUser(receiverUsername, MESSAGES_QUEUE, responseDTO);
        sendToUser(senderUsername, MESSAGES_QUEUE, responseDTO);

        log.info("Message sent from {} to {}", senderUsername, receiverUsername);
    }

    private void saveUnreadMessage(User sender, User receiver, ChatMessage savedMessage) {
        UnreadMessage unreadMessage = new UnreadMessage(receiver, sender, savedMessage);
        unreadMessageRepository.save(unreadMessage);

        long unreadCount = unreadMessageRepository.countUnreadMessagesFromSender(receiver.getId(), sender.getId());
        String preview = createMessagePreview(savedMessage.getContent());

        NotificationDTO notification = new NotificationDTO(
                sender.getId(),
                sender.getUsername(),
                savedMessage.getId(),
                preview,
                unreadCount,
                savedMessage.getTimestamp()
        );

        sendToUser(receiver.getUsername(), NOTIFICATIONS_QUEUE, notification);
    }

    private void validateUserAuthenticated(UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, USER_NOT_AUTHENTICATED);
        }
    }

    private void broadcastStatusToConnections(User user, Status status) {
        if (user == null) return;

        StatusResponse response = new StatusResponse(
                user.getId(),
                user.getUsername(),
                status
        );

        List<Long> connections = user.getConnections();
        for (Long connectionId : connections) {
            User connection = userService.getUserById(connectionId);
            if (connection != null) {
                sendToUser(connection.getUsername(), STATUS_QUEUE, response);
            }
        }
    }

    private void sendToUser(String username, String destination, Object payload) {
        String sanitizedUsername = username.trim().replace(" ", "_");
        messagingTemplate.convertAndSendToUser(sanitizedUsername, destination, payload);
    }
}
