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

    @Query("SELECT c FROM User u JOIN u.connections c WHERE u.id = :userId " +
            "ORDER BY (SELECT MAX(m.timestamp) FROM ChatMessage m " +
            "WHERE (m.sender.id = u.id AND m.receiver.id = c) OR " +
            "(m.sender.id = c AND m.receiver.id = u.id)) DESC NULLS LAST")
    Optional<List<Long>> findUserConnectionsById(@Param("userId") Long userId);

    @Query("SELECT u.likedUsers FROM User u WHERE u.id = :userId")
    Optional<List<Long>> findUserLikedUsersById(@Param("userId") Long userId);

    @Query("SELECT u.pendingRequests FROM User u WHERE u.id = :userId")
    Optional<List<Long>> findUserPendingRequestsById(@Param("userId") Long userId);

    @Query(value = "SELECT u.* FROM users u WHERE ST_DWithin(u.coordinates, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, :radius)" +
            " AND u.id != :userId", nativeQuery = true)
    Optional<List<User>> findUsersWithinRadius(@Param("latitude") double latitude,
                                               @Param("longitude") double longitude,
                                               @Param("radius") int radius,
                                               @Param("userId") Long userId);
}
