package com.app.matchme.repositories;

import com.app.matchme.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT m FROM ChatMessage m " +
            "WHERE ((m.sender.id = :currentUserId AND m.receiver.id = :otherUserId) " +
            "   OR (m.sender.id = :otherUserId AND m.receiver.id = :currentUserId)) " +
            "AND (:beforeId IS NULL OR m.id < :beforeId) " +
            "ORDER BY m.id DESC")
    List<ChatMessage> findChatMessages(
            @Param("currentUserId") Long currentUserId,
            @Param("otherUserId") Long otherUserId,
            @Param("beforeId") Long beforeId,
            Pageable pageable
    );

}
