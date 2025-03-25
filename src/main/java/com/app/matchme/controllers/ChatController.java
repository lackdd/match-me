package com.app.matchme.controllers;

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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    // instead of sendTo use simpMessagingTemplate to deliver message to specific user
    @MessageMapping("/private-message")
    public void sendPrivateMessage(@AuthenticationPrincipal UserPrincipal userPrincipal, @Payload ChatMessageDTO messageDTO) {
        if (userPrincipal == null) {
            System.out.println("Message blocked: User not authenticated.");
            return;
        }
        User sender = userPrincipal.getUser();
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

    /*public enum Status {
        JOIN, // when the user joins the chat for the first time
        MESSAGE, // when the user sends a message
        LEAVE // when the user leaves the chat (logout)
    }*/
}
