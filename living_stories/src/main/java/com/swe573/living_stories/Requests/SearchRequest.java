package com.swe573.living_stories.Requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchRequest {
    private String labels;
    private String header;
    private String text;
    private String username;
    private String startDate;
    private String endDate;
    private String when;

}
