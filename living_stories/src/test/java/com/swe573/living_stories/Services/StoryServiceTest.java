package com.swe573.living_stories.Services;
import com.swe573.living_stories.Models.Story;
import com.swe573.living_stories.Repositories.StoryRepository;
import com.swe573.living_stories.Repositories.UserRepository;
import com.swe573.living_stories.Requests.StoryRequest;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.mockito.MockitoAnnotations;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;



class StoryServiceTest {
    @Mock
    private StoryRepository storyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StoryService storyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createStory_ShouldReturnCreatedStory() {

        Story story = new Story();
        when(storyRepository.save(story)).thenReturn(story);


        Story result = storyService.createStory(story);


        assertNotNull(result);
        assertEquals(story, result);
        verify(storyRepository, times(1)).save(story);
    }

    @Test
    void updateStory_WhenStoryExists_ShouldReturnUpdatedStory() {

        Long id = 1L;
        StoryRequest secondStory = new StoryRequest();
        Story oldStory = new Story();
        when(storyRepository.findById(id)).thenReturn(Optional.of(oldStory));
        when(storyRepository.save(oldStory)).thenReturn(oldStory);


        Story result = storyService.updateStory(id, secondStory);


        assertNotNull(result);
        assertEquals(oldStory, result);
        verify(storyRepository, times(1)).findById(id);
        verify(storyRepository, times(1)).save(oldStory);
    }

    @Test
    void updateStory_WhenStoryDoesNotExist_ShouldThrowEntityNotFoundException() {

        Long id = 1L;
        StoryRequest secondStory = new StoryRequest();
        when(storyRepository.findById(id)).thenReturn(Optional.empty());


        assertThrows(EntityNotFoundException.class,
                () -> storyService.updateStory(id, secondStory));
        verify(storyRepository, times(1)).findById(id);
        verify(storyRepository, never()).save(any(Story.class));
    }
    @Test
    void getAllStories_ShouldReturnListOfStories() {

        List<Story> stories = new ArrayList<>();
        stories.add(new Story());
        stories.add(new Story());
        when(storyRepository.findAll()).thenReturn(stories);


        List<Story> result = storyService.getAllStories();


        assertNotNull(result);
        assertEquals(stories.size(), result.size());
        assertEquals(stories, result);
        verify(storyRepository, times(1)).findAll();
    }

    @Test
    void getStoryById_WhenStoryExists_ShouldReturnStory() {

        Long id = 1L;
        Story story = new Story();
        when(storyRepository.findById(id)).thenReturn(Optional.of(story));


        Story result = storyService.getStoryById(id);


        assertNotNull(result);
        assertEquals(story, result);
        verify(storyRepository, times(1)).findById(id);
    }

    @Test
    void getStoryById_WhenStoryDoesNotExist_ShouldReturnNull() {

        Long id = 1L;
        when(storyRepository.findById(id)).thenReturn(Optional.empty());


        Story result = storyService.getStoryById(id);


        assertNull(result);
        verify(storyRepository, times(1)).findById(id);
    }

    @Test
    void getByUserId_ShouldReturnListOfStories() {

        Long userId = 1L;
        List<Story> stories = new ArrayList<>();
        stories.add(new Story());
        stories.add(new Story());
        when(storyRepository.findByUserId(userId)).thenReturn(stories);


        List<Story> result = storyService.getByUserId(userId);


        assertNotNull(result);
        assertEquals(stories.size(), result.size());
        assertEquals(stories, result);
        verify(storyRepository, times(1)).findByUserId(userId);
    }


}