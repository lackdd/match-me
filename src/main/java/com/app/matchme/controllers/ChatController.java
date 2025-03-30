package com.app.matchme.controllers;

import com.app.matchme.dtos.StatusMessage;
import com.app.matchme.dtos.StatusResponse;
import com.app.matchme.entities.ChatMessage;
import com.app.matchme.entities.ChatMessageDTO;
import com.app.matchme.entities.User;
import com.app.matchme.entities.UserPrincipal;
import com.app.matchme.mappers.ChatMessageMapper;
import com.app.matchme.repositories.ChatMessageRepository;
import com.app.matchme.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // template to send private messages to specific user

    @Autowired
    private UserService userService;

    @Autowired
    private ChatMessageRepository repo;

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

        StatusResponse response = new StatusResponse(
                sender.getId(),
                senderUsername,
                statusMessage.getStatus()
        );

        System.out.println("Status update from " + senderUsername + " to " + receiverUsername + ": " + statusMessage.getStatus());

        messagingTemplate.convertAndSendToUser(
                receiverUsername.trim().replace(" ", "_"),
                "/queue/status",
                response
        );
    }

    // instead of sendTo use simpMessagingTemplate to deliver message to specific user
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

        ChatMessageDTO responseDTO = ChatMessageMapper.toDTO(savedMessage);


        System.out.println("Sending private message from " + senderUsername + " to " + receiverUsername + " Message content: " + messageDTO.getContent());



        // send message to receiver's private queue
        messagingTemplate.convertAndSendToUser(
                receiverUsername.trim().replace(" ", "_"),
                "/queue/messages",
                responseDTO
        );
        messagingTemplate.convertAndSendToUser(
                senderUsername.trim().replace(" ", "_"),
                "/queue/messages",
                responseDTO
        );
        System.out.println("🚀 Message sent to /user/" + receiverUsername.trim().replace(" ", "_") + "/queue/messages");
    }

    public enum Status {
        JOIN,
        TYPING,
        IDLE,
        ACTIVE,
        INACTIVE,
        LEAVE
    }
}
