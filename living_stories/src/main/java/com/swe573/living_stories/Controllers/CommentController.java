package com.swe573.living_stories.Controllers;

import com.swe573.living_stories.Models.Comment;
import com.swe573.living_stories.Models.Story;
import com.swe573.living_stories.Models.User;
import com.swe573.living_stories.Requests.CommentRequest;
import com.swe573.living_stories.Services.CommentService;
import com.swe573.living_stories.Services.StoryService;
import com.swe573.living_stories.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/stories/comments")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private StoryService storyService;
    @Autowired
    UserService userService;

    @DeleteMapping("/{commentId}")
    public String deleteComment(@PathVariable Long commentId){
       if( commentService.deleteCommentById(commentId)){
           return "Deleted";
       }
       return "Problem!";
    }

    @PostMapping
    public ResponseEntity<Object> addCommentToStory(@RequestBody CommentRequest commentRequest, HttpServletRequest request) {
        Long userId = userService.isUserLoggedIn(request);
        Story optionalStory = storyService.getStoryById(commentRequest.getStoryId());
        Optional<User> optionalUser = userService.getUserById(userId);


        if (!optionalUser.isPresent()||optionalStory ==null) {
            return ResponseEntity.notFound().build();
        }
        Comment comment = new Comment();
        comment.setText(commentRequest.getText());
        comment.setUser(optionalUser.get());
        comment.setStory(optionalStory);
        commentService.addCommentToStory(optionalStory.getId(), comment);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/like/{commentId}")
    public String likeComment(HttpServletRequest request, @PathVariable Long commentId){
        Long userId = userService.isUserLoggedIn(request);
        return commentService.likeComment(commentId, userId);
    }


}
