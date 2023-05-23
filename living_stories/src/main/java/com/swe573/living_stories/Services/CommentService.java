package com.swe573.living_stories.Services;

import com.swe573.living_stories.Models.Comment;
import com.swe573.living_stories.Models.Story;
import com.swe573.living_stories.Models.User;
import com.swe573.living_stories.Repositories.CommentRepository;
import com.swe573.living_stories.Repositories.StoryRepository;
import com.swe573.living_stories.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment addCommentToStory(Long storyId, Comment comment) {
        Optional<Story> optionalStory = storyRepository.findById(storyId);
        if (optionalStory.isPresent()) {
            Story story = optionalStory.get();
            comment.setStory(story);
            return commentRepository.save(comment);
        } else {
            throw new RuntimeException("Story not found");
        }
    }
    public boolean deleteCommentById(Long commentId){
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()){
            commentRepository.deleteById(commentId);
            return true;
        }
        return false;

    }



    public String likeComment(Long commentId , Long userId){
        Optional<User> optionalUser = userRepository.findById(userId);
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()&& optionalUser.isPresent()){
            Comment comment = optionalComment.get();
            ArrayList<Long> likes  = comment.getLikes();
            if(!likes.contains(userId)){

                likes.add(userId);
                comment.setLikes(likes);
                commentRepository.save(comment);
                return "User liked comment!";
            } else if (likes.contains(userId)) {
                likes.remove(userId);
                comment.setLikes(likes);
                commentRepository.save(comment);
                return "User unliked comment";


            }

        }

        return "User or comment cannot be found!";

    }

}
