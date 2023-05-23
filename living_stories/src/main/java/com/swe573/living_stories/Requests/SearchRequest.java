package com.swe573.living_stories.Requests;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRequest {
    private String header;
    private String name;
    private String city;
    private String country;
    private String startDate;
    private String endDate;
    private String text;
    private Double longitude;
    private Double latitude;
    private Double radius;
    private String startSeason;
    private String endSeason;
    private String label;

}
