package com.app.matchme.dtos;

import java.time.LocalDateTime;

public class NotificationDTO {
    private Long senderId;
    private String senderUsername;
    private Long messageId;
    private String messagePreview;
    private Long count;
    private LocalDateTime lastMessageTime;

    public NotificationDTO() {
    }

    public NotificationDTO(Long senderId, String senderUsername, Long messageId, String messagePreview, Long count, LocalDateTime lastMessageTime) {
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.messageId = messageId;
        this.messagePreview = messagePreview;
        this.count = count;
        this.lastMessageTime = lastMessageTime;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public String getMessagePreview() {
        return messagePreview;
    }

    public void setMessagePreview(String messagePreview) {
        this.messagePreview = messagePreview;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(LocalDateTime lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }
}
