package com.app.matchme.repositories;

import com.app.matchme.entities.UnreadMessage;
import com.app.matchme.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnreadMessageRepository extends JpaRepository<UnreadMessage, Long> {

    List<UnreadMessage> findByUserAndReadFalseOrderByMessageTimestampDesc(User user);

    @Query("SELECT COUNT(um) FROM UnreadMessage um WHERE um.user.id = :userId AND um.read = false")
    long countUnreadMessagesForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(um) FROM UnreadMessage um WHERE um.user.id = :userId AND um.sender.id = :senderId AND um.read = false")
    long countUnreadMessagesFromSender(@Param("userId") Long userId, @Param("senderId") Long senderId);

    @Modifying
    @Query("UPDATE UnreadMessage um SET um.read = true WHERE um.user.id = :userId AND um.sender.id = :senderId")
    void markMessagesAsRead(@Param("userId") Long userId, @Param("senderId") Long senderId);

    @Query("SELECT DISTINCT um.sender.id FROM UnreadMessage um WHERE um.user.id = :userId AND um.read = false")
    List<Long> findDistinctSendersWithUnreadMessages(@Param("userId") Long userId);
}
