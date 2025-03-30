package com.app.matchme.dtos;

import com.app.matchme.controllers.ChatController;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusResponse {
    private Long userId;
    private String username;
    private ChatController.Status status;
}
