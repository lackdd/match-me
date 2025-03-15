package com.app.matchme.controllers;

import com.app.matchme.entities.ChatMessage;
import com.app.matchme.entities.ChatMessageDTO;
import com.app.matchme.entities.User;
import com.app.matchme.mappers.ChatMessageMapper;
import com.app.matchme.repositories.ChatMessageRepository;
import com.app.matchme.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/history/{userId1}/{userId2}")
    public List<ChatMessageDTO> getChatHistory(@RequestHeader(value = "Authorization", required = false) String authHeader, @PathVariable Long userId1, @PathVariable Long userId2) {
        List<ChatMessage> messages = repo.findBySenderAndReceiverOrReceiverAndSender(userId1, userId2);

        return messages.stream()
                .map(ChatMessageMapper::toDTO)
                .collect(Collectors.toList());
    }

    // instead of sendTo use simpMessagingTemplate to deliver message to specific user
    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload ChatMessageDTO messageDTO) {
        User sender = userService.getUserById(messageDTO.getSenderId());
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
