package com.sanan.living_memories.requests;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class StoryRequest {

    private String text;

    private Long userId;

    private String header;

    private ArrayList<String> labels;






}

