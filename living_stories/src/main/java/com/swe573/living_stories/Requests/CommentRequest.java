package com.swe573.living_stories.Requests;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CommentRequest {
    private String text;



    private Long storyId;



}
