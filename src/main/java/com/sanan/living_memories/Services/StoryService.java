package com.sanan.living_memories.Services;

import com.sanan.living_memories.Models.Story;
import com.sanan.living_memories.Models.User;
import com.sanan.living_memories.Repositories.StoryRepository;
import com.sanan.living_memories.Repositories.UserRepository;
import com.sanan.living_memories.requests.StoryRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoryService {

    @Autowired
    private StoryRepository storyRepository;


    public Story createStory(Story story) {
        return storyRepository.save(story);
    }

    public Story updateStory(Long id, StoryRequest secondStory) {
        Story oldStory = storyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        if (secondStory.getText() != null) {
            oldStory.setText(secondStory.getText());
        }
        if (secondStory.getHeader() != null) {
            oldStory.setHeader(secondStory.getHeader());
        }

        return storyRepository.save(oldStory);
    }

    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    public Story getStoryById(Long id) {
        Optional<Story> story = storyRepository.findById(id);
        if (story.isPresent()){
            return story.get();
        }
        return null;
    }

    public List<Story> getByUserId(Long userId) {
        return storyRepository.findByUserId(userId);
    }






}
