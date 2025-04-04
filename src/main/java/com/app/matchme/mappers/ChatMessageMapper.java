package com.app.matchme.mappers;

import com.app.matchme.entities.ChatMessage;
import com.app.matchme.dtos.ChatMessageDTO;

public class ChatMessageMapper {

    private ChatMessageMapper() {}

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
}
