package com.swe573.living_stories.Requests;

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

}
