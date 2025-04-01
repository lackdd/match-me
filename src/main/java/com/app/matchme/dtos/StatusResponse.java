package com.app.matchme.dtos;

import com.app.matchme.controllers.ChatController;

public record StatusResponse(Long userId, String username, ChatController.Status status) {
}
