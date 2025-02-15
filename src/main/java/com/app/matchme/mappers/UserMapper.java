package com.app.matchme.mappers;

import com.app.matchme.entities.ProfileDTO;
import com.app.matchme.entities.UserDTO;
import com.app.matchme.entities.UsernamePictureDTO;
import com.app.matchme.entities.User;


public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        return new UserDTO(
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

    public static UsernamePictureDTO toUsernamePictureDTO(User user) {
        if (user == null) {
            return null;
        }

        String cloudinaryBaseUrl = "https://res.cloudinary.com/djfqpfthj/image/upload/";
        String profilePictureUrl = cloudinaryBaseUrl + user.getProfilePicture();

        return new UsernamePictureDTO(user.getUsername(), profilePictureUrl);
    }

    public static ProfileDTO toProfileDTO(User user) {
        if (user == null) {
            return null;
        }

        return new ProfileDTO(user.getGender(), user.getAge(), user.getLocation(), user.getLinkToMusic(), user.getDescription(), user.getPreferredMusicGenres(), user.getPreferredMethods(), user.getPersonalityTraits(), user.getAdditionalInterests(), user.getGoalsWithMusic(), user.getYearsOfMusicExperience());
    }
}
