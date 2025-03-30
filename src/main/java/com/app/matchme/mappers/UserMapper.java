package com.app.matchme.mappers;

import com.app.matchme.entities.*;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setGender(user.getGender());
        userDTO.setProfilePicture(user.getProfilePicture());
        userDTO.setAge(user.getAge());
        userDTO.setPreferredMethod(user.getPreferredMethods());
        userDTO.setPreferredMusicGenres(user.getPreferredMusicGenres());
        userDTO.setPersonalityTraits(user.getPersonalityTraits());
        userDTO.setAdditionalInterests(user.getAdditionalInterests());
        userDTO.setYearsOfMusicExperience(user.getYearsOfMusicExperience());
        userDTO.setGoalsWithMusic(user.getGoalsWithMusic());
        userDTO.setLocation(user.getLocation());
        userDTO.setLinkToMusic(user.getLinkToMusic());
        userDTO.setDescription(user.getDescription());
        userDTO.setIdealMatchGoals(user.getIdealMatchGoals());
        userDTO.setIdealMatchMethods(user.getIdealMatchMethods());
        userDTO.setIdealMatchGenres(user.getIdealMatchGenres());
        userDTO.setIdealMatchGender(user.getIdealMatchGender());
        userDTO.setIdealMatchAge(user.getIdealMatchAge());
        userDTO.setIdealMatchYearsOfExperience(user.getIdealMatchYearsOfExperience());
        userDTO.setIdealMatchLocation(user.getIdealMatchLocation());
        userDTO.setConnections(user.getConnections());

        return userDTO;
    }

    public static UsernamePictureDTO toUsernamePictureDTO(User user) {
        if (user == null) {
            return null;
        }

        String cloudinaryBaseUrl = "https://res.cloudinary.com/djfqpfthj/image/upload/";
        String profilePictureUrl = cloudinaryBaseUrl + user.getProfilePicture();

        UsernamePictureDTO dto = new UsernamePictureDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setProfilePicture(profilePictureUrl);

        return dto;
    }

    public static ProfileDTO toProfileDTO(User user) {
        if (user == null) {
            return null;
        }

        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setId(user.getId());
        profileDTO.setGender(user.getGender());
        profileDTO.setAge(user.getAge());
        profileDTO.setLocation(user.getLocation());
        profileDTO.setLinkToMusic(user.getLinkToMusic());
        profileDTO.setDescription(user.getDescription());
        profileDTO.setPreferredMusicGenres(user.getPreferredMusicGenres());
        profileDTO.setPreferredMethod(user.getPreferredMethods());
        profileDTO.setPersonalityTraits(user.getPersonalityTraits());
        profileDTO.setAdditionalInterests(user.getAdditionalInterests());
        profileDTO.setGoalsWithMusic(user.getGoalsWithMusic());
        profileDTO.setYearsOfMusicExperience(user.getYearsOfMusicExperience());

        return profileDTO;
    }

    public static BioDTO toBioDTO(User user) {
        if (user == null) {
            return null;
        }

        BioDTO bioDTO = new BioDTO();
        bioDTO.setId(user.getId());
        bioDTO.setGender(user.getGender());
        bioDTO.setAge(user.getAge());
        bioDTO.setPreferredMusicGenres(user.getPreferredMusicGenres());
        bioDTO.setPreferredMethod(user.getPreferredMethods());
        bioDTO.setAdditionalInterests(user.getAdditionalInterests());
        bioDTO.setPersonalityTraits(user.getPersonalityTraits());
        bioDTO.setGoalsWithMusic(user.getGoalsWithMusic());
        bioDTO.setYearsOfMusicExperience(user.getYearsOfMusicExperience());
        bioDTO.setLocation(user.getLocation());
        bioDTO.setIdealMatchGenres(user.getIdealMatchGenres());
        bioDTO.setIdealMatchMethods(user.getIdealMatchMethods());
        bioDTO.setIdealMatchGoals(user.getIdealMatchGoals());
        bioDTO.setIdealMatchGender(user.getIdealMatchGender());
        bioDTO.setIdealMatchAge(user.getIdealMatchAge());
        bioDTO.setIdealMatchYearsOfExperience(user.getIdealMatchYearsOfExperience());
        bioDTO.setIdealMatchLocation(user.getIdealMatchLocation());

        return bioDTO;
    }
}
