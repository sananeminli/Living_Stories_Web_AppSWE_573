package com.swe573.living_stories.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Base64;

@Getter
@Setter




public class MediaDTO {

    private String data;
    private String type;

    public MediaDTO(String type, byte[] data){
        this.type =type;
        this.data = Base64.getEncoder().encodeToString(data);

    }
}
