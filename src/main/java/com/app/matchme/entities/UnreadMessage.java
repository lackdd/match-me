package com.app.matchme.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "unread_messages")
public class UnreadMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    private ChatMessage message;

    private boolean read = false;

    public UnreadMessage(User user, User sender, ChatMessage message) {
        this.user = user;
        this.sender = sender;
        this.message = message;
        this.read = false;
    }
}
