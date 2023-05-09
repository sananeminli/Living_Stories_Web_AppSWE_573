package com.swe573.living_stories.Requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRequest {
    private String header;
    private String name;
    private String startDate;
    private String endDate;

}
