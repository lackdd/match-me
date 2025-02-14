package com.app.matchme.mapper;

import com.app.matchme.entities.UserProfileDTO;
import com.app.matchme.entities.UsernamePictureDTO;
import com.app.matchme.entities.Users;


public class UserMapper {
    public static UserProfileDTO toDTO(Users user) {
        if (user == null) {
            return null;
        }
        return new UserProfileDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getGender(),
                user.getProfilePicture(),
                user.getAge(),
                user.getPreferredMethods(),
                user.getPreferredMusicGenres(),
                user.getPersonalityTraits(),
                user.getAdditionalInterests(),
                user.getYearsOfMusicExperience(),
                user.getGoalsWithMusic(),
                user.getLocation(),
                user.getLinkToMusic(),
                user.getDescription(),
                user.getIdealMatchGoals(),
                user.getIdealMatchMethods(),
                user.getIdealMatchGenres(),
                user.getIdealMatchGender(),
                user.getIdealMatchAge(),
                user.getIdealMatchYearsOfExperience(),
                user.getIdealMatchLocation()
        );
    }

    public static UsernamePictureDTO toUsernamePictureDTO(Users user) {
        if (user == null) {
            return null;
        }

        String cloudinaryBaseUrl = "https://res.cloudinary.com/djfqpfthj/image/upload/";
        String profilePictureUrl = cloudinaryBaseUrl + user.getProfilePicture();

        return new UsernamePictureDTO(user.getUsername(), profilePictureUrl);
    }
}
