package com.swe573.living_stories.Services;

import com.swe573.living_stories.Models.Comment;
import com.swe573.living_stories.Models.Story;
import com.swe573.living_stories.Models.User;
import com.swe573.living_stories.Repositories.CommentRepository;
import com.swe573.living_stories.Repositories.StoryRepository;
import com.swe573.living_stories.Repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceTest {
    @Mock
    private CommentRepository commentRepository;

    @Mock
    private StoryRepository storyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void addCommentToStory_WhenStoryExists_ShouldSaveComment() {

        Long storyId = 1L;
        Comment comment = new Comment();
        Story story = new Story();
        when(storyRepository.findById(storyId)).thenReturn(Optional.of(story));
        when(commentRepository.save(comment)).thenReturn(comment);


        Comment result = commentService.addCommentToStory(storyId, comment);


        assertNotNull(result);
        assertEquals(comment, result);
        assertEquals(story, comment.getStory());
        verify(storyRepository, times(1)).findById(storyId);
        verify(commentRepository, times(1)).save(comment);
    }
    @Test
    void addCommentToStory_WhenStoryDoesNotExist_ShouldThrowException() {
        // Arrange
        Long storyId = 1L;
        Comment comment = new Comment();
        when(storyRepository.findById(storyId)).thenReturn(Optional.empty());


        assertThrows(RuntimeException.class,
                () -> commentService.addCommentToStory(storyId, comment));
        verify(storyRepository, times(1)).findById(storyId);
        verify(commentRepository, never()).save(comment);
    }
    @Test
    void likeComment_WhenUserAndCommentExistAndUserLikesComment_ShouldReturnLikedMessage() {
        // Arrange
        Long commentId = 1L;
        Long userId = 1L;
        User user = new User();
        Comment comment = new Comment();
        comment.setLikes(new ArrayList<>());
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        // Act
        String result = commentService.likeComment(commentId, userId);

        // Assert
        assertEquals("User liked comment!", result);
        assertTrue(comment.getLikes().contains(userId));
        verify(userRepository, times(1)).findById(userId);
        verify(commentRepository, times(1)).findById(commentId);
        verify(commentRepository, times(1)).save(comment);
    }

    @Test
    void likeComment_WhenCommentDoesNotExist_ShouldReturnNotFoundMessage() {
        // Arrange
        Long commentId = 1L;
        Long userId = 1L;
        User user = new User();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        // Act
        String result = commentService.likeComment(commentId, userId);

        // Assert
        assertEquals("User or comment cannot be found!", result);
        verify(userRepository, times(1)).findById(userId);
        verify(commentRepository, times(1)).findById(commentId);
        verify(commentRepository, never()).save(any(Comment.class));
    }





}