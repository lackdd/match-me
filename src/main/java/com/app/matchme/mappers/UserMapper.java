package com.app.matchme.mappers;

import com.app.matchme.dtos.BioDTO;
import com.app.matchme.dtos.ProfileDTO;
import com.app.matchme.dtos.UsernamePictureDTO;
import com.app.matchme.entities.*;

public class UserMapper {
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
        profileDTO.setMaxMatchRadius(user.getMaxMatchRadius());
        if (user.getCoordinates() != null) {
            profileDTO.setLatitude(user.getCoordinates().getY());
            profileDTO.setLongitude(user.getCoordinates().getX());
        }

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
        bioDTO.setMaxMatchRadius(user.getMaxMatchRadius());
        if (user.getCoordinates() != null) {
            bioDTO.setLatitude(user.getCoordinates().getY());
            bioDTO.setLongitude(user.getCoordinates().getX());
        }

        return bioDTO;
    }
}
