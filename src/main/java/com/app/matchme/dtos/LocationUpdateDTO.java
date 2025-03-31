package com.app.matchme.dtos;

public record LocationUpdateDTO(String location, Double latitude, Double longitude, Integer maxMatchRadius) {
}
