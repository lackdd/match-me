package com.app.matchme;

import com.app.matchme.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
@Slf4j
class UserServiceTest {
    private final UserService userService;

    @Autowired
    public UserServiceTest(UserService userService) {this.userService = userService;}

    @Test
    void getRecommendedListPerUser() {
        for(long i = 1; i < 101; i++) {
            List<Long> recommended = userService.findMatches(i);
            log.info("Current user id: " + i + " and recommended list: " + recommended);
        }
    }

    @Test
    @Transactional
    void getLikedUsersByIdWhenUserExists() {
        Long userId = 48L;
        List<Long> likedUsers = userService.getLikedUsersById(userId);
        log.info("User ID: " + userId + " liked users: " + likedUsers);
    }
}
