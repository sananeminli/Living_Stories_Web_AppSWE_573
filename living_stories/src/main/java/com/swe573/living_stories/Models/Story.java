package com.swe573.living_stories.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIncludeProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.swe573.living_stories.DTO.MediaDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "stories")
@Getter
@Setter


    public class Story {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;


        @JsonIgnore
        private String text;

        @NotBlank
        private String header;


        @Column
        private ArrayList<String> labels = new ArrayList<>();

        @Column
        private ArrayList<Long> likes = new ArrayList<>();



        private Date startDate;


        private Date endDate;

        @NotBlank
        @Column(columnDefinition = "TEXT")
        private String richText;







        @JsonIncludeProperties(value = {"id" , "name", "photo"})
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
        private List<Comment> comments = new ArrayList<>();




        @JsonIgnore
        @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
        private List<Media> media = new ArrayList<>();

        @OneToMany(mappedBy = "story", cascade = CascadeType.ALL)
        private List<Locations> locations = new ArrayList<>();





        @JsonProperty("meida")
        public ArrayList<MediaDTO> getMediaDTOList() {
            ArrayList<MediaDTO> mediaDTOList = new ArrayList<>();
            for (Media photos : media) {
                mediaDTOList.add(new MediaDTO(photos.getType(),photos.getData()));
            }
            return mediaDTOList;
        }






}
