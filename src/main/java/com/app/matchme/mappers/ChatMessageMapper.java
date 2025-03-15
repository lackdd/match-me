package com.app.matchme.mappers;

import com.app.matchme.entities.ChatMessage;
import com.app.matchme.entities.ChatMessageDTO;
import com.app.matchme.entities.User;

public class ChatMessageMapper {
    public static ChatMessageDTO toDTO(ChatMessage chatMessage) {
        return new ChatMessageDTO(
                chatMessage.getId(),
                chatMessage.getSender().getId(),
                chatMessage.getReceiver().getId(),
                chatMessage.getSender().getUsername(),
                chatMessage.getReceiver().getUsername(),
                chatMessage.getContent(),
                chatMessage.getTimestamp()
        );
    }
    public static ChatMessage toEntity(ChatMessageDTO chatMessageDTO, User sender, User receiver) {
        return new ChatMessage(sender, receiver, chatMessageDTO.getContent());
    }
}
