package com.app.matchme.dtos;

import java.time.LocalDateTime;

public record NotificationDTO(Long senderId, String senderUsername, Long messageId, String messagePreview,
                              Long count, LocalDateTime lastMessageTime) {
}
