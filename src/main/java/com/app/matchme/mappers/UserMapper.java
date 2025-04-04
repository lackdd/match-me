package com.app.matchme.mappers;

import com.app.matchme.dtos.BioDTO;
import com.app.matchme.dtos.ProfileDTO;
import com.app.matchme.dtos.UsernamePictureDTO;
import com.app.matchme.dtos.apirequestdtos.RegisterRequest;
import com.app.matchme.entities.*;
import com.app.matchme.utils.GeoUtils;
import org.locationtech.jts.geom.Point;

import java.util.ArrayList;

public class UserMapper {

    private UserMapper() {}

    public static UsernamePictureDTO toUsernamePictureDTO(User user) {
        String cloudinaryBaseUrl = "https://res.cloudinary.com/djfqpfthj/image/upload/";
        String profilePictureUrl = cloudinaryBaseUrl + user.getProfilePicture();

        UsernamePictureDTO dto = new UsernamePictureDTO();

        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setProfilePicture(profilePictureUrl);
        return dto;
    }

    public static ProfileDTO toProfileDTO(User user) {
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

    public static void fromProfileDTOtoUser(User user, ProfileDTO dto) {
        user.setPreferredMusicGenres(dto.getPreferredMusicGenres());
        user.setPreferredMethods(dto.getPreferredMethod());
        user.setAdditionalInterests(dto.getAdditionalInterests());
        user.setPersonalityTraits(dto.getPersonalityTraits());
        user.setGoalsWithMusic(dto.getGoalsWithMusic());
        user.setLinkToMusic(dto.getLinkToMusic());
        user.setLocation(dto.getLocation());
        user.setDescription(dto.getDescription());
        user.setYearsOfMusicExperience(dto.getYearsOfMusicExperience());
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            Point point = GeoUtils.createPoint(dto.getLatitude(), dto.getLongitude());
            user.setCoordinates(point);
        }
        user.setMaxMatchRadius(dto.getMaxMatchRadius());
    }

    public static BioDTO toBioDTO(User user) {
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

    public static void fromBioDTOtoUser(User user, BioDTO dto) {
        user.setIdealMatchGenres(dto.getIdealMatchGenres());
        user.setIdealMatchMethods(dto.getIdealMatchMethods());
        user.setIdealMatchGoals(dto.getIdealMatchGoals());
        user.setIdealMatchGender(dto.getIdealMatchGender());
        user.setIdealMatchAge(dto.getIdealMatchAge());
        user.setIdealMatchYearsOfExperience(dto.getIdealMatchYearsOfExperience());
        user.setIdealMatchLocation(dto.getIdealMatchLocation());
    }

    public static User fromRegisterRequestToUser(RegisterRequest request) {
        User user = new User();

        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setUsername(request.username());
        user.setProfilePicture(request.profilePicture());
        user.setGender(request.gender());
        user.setAge(request.age());

        user.setPreferredMusicGenres(request.preferredMusicGenres());
        user.setPreferredMethods(request.preferredMethods());
        user.setAdditionalInterests(request.additionalInterests());
        user.setPersonalityTraits(request.personalityTraits());
        user.setGoalsWithMusic(request.goalsWithMusic());
        user.setYearsOfMusicExperience(request.yearsOfMusicExperience());

        user.setLocation(request.location());

        if (request.latitude() != null && request.longitude() != null) {
            Point point = GeoUtils.createPoint(request.latitude(), request.longitude());
            user.setCoordinates(point);
        }

        user.setMaxMatchRadius(request.maxMatchRadius());

        user.setIdealMatchGenres(request.idealMatchGenres());
        user.setIdealMatchMethods(request.idealMatchMethods());
        user.setIdealMatchGoals(request.idealMatchGoals());
        user.setIdealMatchGender(request.idealMatchGender());
        user.setIdealMatchAge(request.idealMatchAge());
        user.setIdealMatchYearsOfExperience(request.idealMatchYearsOfExperience());
        user.setIdealMatchLocation(request.idealMatchLocation());

        user.setConnections(new ArrayList<>());
        user.setLikedUsers(new ArrayList<>());
        user.setPendingRequests(new ArrayList<>());
        user.setSwipedUsers(new ArrayList<>());

        return user;
    }
}
