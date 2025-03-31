package com.app.matchme.entities;

import lombok.Data;

@Data
public class LocationUpdateDTO {
    private String location; // Text description
    private Double latitude;
    private Double longitude;
    private Integer maxMatchRadius;
}
