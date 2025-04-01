package com.app.matchme.dtos;

import java.time.LocalDateTime;

public record ChatMessageDTO(Long id, Long senderId, Long receiverId, String senderUsername,
                             String receiverUsername, String content, LocalDateTime timestamp) {
}
