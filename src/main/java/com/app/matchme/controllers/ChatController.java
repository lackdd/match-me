package com.app.matchme.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/message")  // clients send messages here
    @SendTo("/topic/messages")   // messages are broadcasted here
    public ChatMessage sendMessage(ChatMessage message) {
        return message; // simply return the message (Modify for persistence if needed)
    }

    public static class ChatMessage {
        private String sender;
        private String content;

        public ChatMessage() {}

        public ChatMessage(String sender, String content) {
            this.sender = sender;
            this.content = content;
        }

        public String getSender() {
            return sender;
        }

        public void setSender(String sender) {
            this.sender = sender;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
