package com.app.matchme.dtos;

import com.app.matchme.controllers.ChatController;

public record StatusMessage(Long receiverId, ChatController.Status status) {
}
