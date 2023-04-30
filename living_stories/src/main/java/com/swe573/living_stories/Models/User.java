package com.swe573.living_stories.Models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class User{

    @jakarta.persistence.Id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank
    @Column(unique = true)
    private String name;

    @Email
    @Column(unique = true)
    private String email;


    @NotBlank
    @Column
    private String password;

    @Lob
    private byte[] photo;

    @Column(columnDefinition = "TEXT")
    private String biography;



    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Story> stories;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Comment> comments;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Like> likes;




    @JsonIgnoreProperties({"followers", "email" , "password" , "biography" , "stories","following"})
    @ManyToMany(fetch = FetchType.LAZY,cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "followers",
            joinColumns = @JoinColumn(name = "following_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id"))
    private Set<User> followers = new HashSet<>();

    @ManyToMany(mappedBy = "followers", fetch = FetchType.LAZY,cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JsonIgnoreProperties({"followers", "email" , "password" , "biography" , "stories","following"})
    private Set<User> following = new HashSet<>();


    @PreRemove
    private void removeFollowersAndFollowing() {
        for (User follower : followers) {
            follower.getFollowing().remove(this);
        }
        for (User followed : following) {
            followed.getFollowers().remove(this);
        }
    }




}
