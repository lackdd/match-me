package com.app.matchme.repositories;

import com.app.matchme.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u.connections FROM User u WHERE u.id = :userId")
    List<Long> findUserConnectionsById(@Param("userId") Long userId);

    @Query(value = "SELECT connection_id FROM connections WHERE user_id = (SELECT id FROM users WHERE username = :userUsername)", nativeQuery = true)
    List<Long> findUserConnectionsByUsername(@Param("userUsername") String userUsername);

    @Query("SELECT u.likedUsers FROM User u WHERE u.id = :userId")
    List<Long> findUserLikedUsersById(@Param("userId") Long userId);

    @Query("SELECT u.pendingRequests FROM User u WHERE u.id = :userId")
    List<Long> findUserPendingRequestsById(@Param("userId") Long userId);

}
