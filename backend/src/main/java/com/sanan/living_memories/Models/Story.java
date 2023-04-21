package com.sanan.living_memories.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "stories")
@Getter
@Setter


    public class Story {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;



        @NotBlank
        @Column(columnDefinition = "TEXT")
        private String text;

        @NotBlank
        private String header;


        @Column
        private ArrayList<String> labels = new ArrayList<>();


        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
        private Set<Comment> comments = new HashSet<>();


        @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Like> likes = new ArrayList<>();
        @OneToMany(mappedBy = "story", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY, orphanRemoval = true)
        private Set<Media> media = new HashSet<>();

        @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Locations> locations = new ArrayList<>();


}
