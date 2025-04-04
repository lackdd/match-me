package com.app.matchme.dtos.apirequestdtos;

public record LocationRequest(
        String location,
        Double latitude,
        Double longitude,
        Integer maxMatchRadius
) {
}
