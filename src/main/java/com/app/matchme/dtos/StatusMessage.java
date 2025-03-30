package com.app.matchme.dtos;

import com.app.matchme.controllers.ChatController;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusMessage {
    private Long receiverId;
    private ChatController.Status status;
}
