package com.swe573.living_stories.Controllers;

import com.swe573.living_stories.Models.Media;
import com.swe573.living_stories.DTO.MediaDTO;
import com.swe573.living_stories.Models.Story;
import com.swe573.living_stories.Models.User;
import com.swe573.living_stories.Requests.SearchRequest;
import com.swe573.living_stories.Requests.StoryRequest;
import com.swe573.living_stories.Services.StoryService;
import com.swe573.living_stories.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/stories")
@CrossOrigin
public class StoryController {
    @Autowired
    UserService userService;

    @Autowired
    private StoryService storyService;





    @PostMapping
    public ResponseEntity<Story> createStory(@RequestBody StoryRequest storyRequest, HttpServletRequest request) {
        Long id  = userService.isUserLoggedIn(request);
        Optional<User> optionalUser = userService.getUserById(id);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Story story = new Story();
        story.setText(storyRequest.getText());
        story.setUser(optionalUser.get());
        story.setHeader(storyRequest.getHeader());
        story.setLabels(storyRequest.getLabels());
        story.setRichText(storyRequest.getRichText());
        Story savedStory = storyService.createStory(story);
        if (storyRequest.getLocations() !=null){
            storyService.addLocation(savedStory.getId(),storyRequest.getLocations());
        }
        if (storyRequest.getMediaString()!=null){
            storyService.addMedia(savedStory.getId(), storyRequest.getMediaString());

        }
        if (storyRequest.getStartDate() != null){
           storyService.addStartDate(savedStory.getId(),storyRequest.getStartDate());
        }
        if (storyRequest.getEndDate() != null){
            storyService.addEndDate(savedStory.getId(),storyRequest.getEndDate());
        }
        if (storyRequest.getStartSeason() != null){
            storyService.addSeason(savedStory.getId(),storyRequest.getStartSeason(),0);
        }
        if (storyRequest.getEndSeason() != null){
            storyService.addSeason(savedStory.getId(),storyRequest.getEndSeason(),1);
        }

        return ResponseEntity.ok(savedStory);
    }
    @GetMapping("/following")
    public List<Story> getFollowingUsers(HttpServletRequest request){
        Long id = userService.isUserLoggedIn(request);
        return  storyService.getFollowingStories(id);
    }



    @PostMapping("/edit/{id}")
    public ResponseEntity<Story> updateStory(@PathVariable Long id, @RequestBody StoryRequest storyRequest,HttpServletRequest request) {
        Long userId = userService.isUserLoggedIn(request);
        Story existingStory = storyService.getStoryById(id);
        if (existingStory!=null) {

            Story updatedStory = storyService.updateStory(id ,storyRequest);
            return ResponseEntity.ok(updatedStory);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/{id}/photo")
    public List<MediaDTO> getMeida(@PathVariable Long id, HttpServletRequest request){
        userService.isUserLoggedIn(request);
        Story story = storyService.getStoryById(id);
        if (story.getMedia() != null) {
            List<Media> media = story.getMedia();
            List<MediaDTO> mediaDTOList = new ArrayList<>();
            for (Media photos : media) {
                mediaDTOList.add(new MediaDTO(photos.getType(),photos.getData()));
            }
            return mediaDTOList;
        }
        return null;
    }
    @GetMapping
    public ResponseEntity<List<Story>> getAllStories(HttpServletRequest request) {
        Long userId = userService.isUserLoggedIn(request);

        List<Story> stories = storyService.getAllStories();
        return ResponseEntity.ok(stories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Story> getStoryById(@PathVariable Long id, HttpServletRequest request) {
        Long userId = userService.isUserLoggedIn(request);
        Story story = storyService.getStoryById(id);
        if (story!=null) {
            return ResponseEntity.ok(story);
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("/get")
    public List<Story> getUserStories(HttpServletRequest request)  {
        Long userId  = userService.isUserLoggedIn(request);
        return storyService.getByUserId(userId);
    }

    @PostMapping("/search")
    public List<Story> search(HttpServletRequest request , @RequestBody SearchRequest searchRequest){
        userService.isUserLoggedIn(request);
        return storyService.newsearch(searchRequest);
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable Long id ){
         storyService.deleteStoryById(id);
         return "done";
    }



    @PostMapping("/like/{storyId}")
    public String likeStory(HttpServletRequest request, @PathVariable Long storyId){
        Long userId = userService.isUserLoggedIn(request);
        return storyService.likeStory(storyId, userId);
    }





}
