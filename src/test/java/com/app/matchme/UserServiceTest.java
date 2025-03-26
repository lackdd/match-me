package com.app.matchme;

import com.app.matchme.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class UserServiceTest {
    private final UserService userService;

    @Autowired
    public UserServiceTest(UserService userService) {this.userService = userService;}

    @Test
    void getRecommendedListPerUser() {
        for(long i = 1; i < 101; i++) {
            List<Long> recommended = userService.findMatches(i);
            System.out.println("Current user id: " + i + " and recommended list: " + recommended);
        }
    }
}
