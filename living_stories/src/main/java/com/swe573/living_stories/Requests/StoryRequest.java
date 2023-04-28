package com.swe573.living_stories.Requests;

import com.swe573.living_stories.DTO.MediaDTO;
import com.swe573.living_stories.Models.Locations;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class StoryRequest {

    private String text;

    private String header;

    private ArrayList<String> labels;

    private ArrayList<Locations> locations;

    private ArrayList<MediaDTO> mediaString;

    private String startDate;

    private String endDate;





}

