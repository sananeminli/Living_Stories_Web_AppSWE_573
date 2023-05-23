package com.swe573.living_stories.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;



@Entity
@Table(name = "locations")
@Getter
@Setter
public class Locations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private Double lat;

    @NonNull
    private Double lng;

    @NonNull
    private String name;

    private String city;
    private String country;




    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

}
