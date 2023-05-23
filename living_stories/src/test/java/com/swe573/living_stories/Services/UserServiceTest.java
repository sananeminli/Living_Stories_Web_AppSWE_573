package com.swe573.living_stories.Services;

import com.swe573.living_stories.Confrugation.JwtUtils;

import com.swe573.living_stories.Models.User;

import com.swe573.living_stories.Repositories.UserRepository;
import com.swe573.living_stories.Requests.EditUser;
import com.swe573.living_stories.Requests.SearchRequest;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
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

class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createUser_ShouldReturnCreatedUser() {
        // Arrange
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);

        // Act
        User result = userService.createUser(user);

        // Assert
        assertNotNull(result);
        assertEquals(user, result);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void profilePage_WhenUserExists_ShouldReturnUser() {
        // Arrange
        String username = "testuser";
        Optional<User> optionalUser = Optional.of(new User());
        when(userRepository.findByName(username)).thenReturn(optionalUser);

        // Act
        User result = userService.profilePage(username);

        // Assert
        assertNotNull(result);
        assertEquals(optionalUser.get(), result);
        verify(userRepository, times(1)).findByName(username);
    }

    @Test
    void profilePage_WhenUserDoesNotExist_ShouldReturnNull() {
        // Arrange
        String username = "testuser";
        when(userRepository.findByName(username)).thenReturn(Optional.empty());

        // Act
        User result = userService.profilePage(username);

        // Assert
        assertNull(result);
        verify(userRepository, times(1)).findByName(username);
    }

    @Test
    void isUserLoggedIn_WhenValidCookieExists_ShouldReturnUserId() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        Cookie validCookie = new Cookie("jwt_Token", "valid_token");
        when(request.getCookies()).thenReturn(new Cookie[]{validCookie});
        Long userId = 1L;
        User user = new User();
        when(jwtUtils.extractId(validCookie.getValue())).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jwtUtils.validateToken(validCookie.getValue(), user)).thenReturn(true);

        // Act
        Long result = userService.isUserLoggedIn(request);

        // Assert
        assertNotNull(result);
        assertEquals(userId, result);
        verify(request, times(1)).getCookies();
        verify(jwtUtils, times(1)).extractId(validCookie.getValue());
        verify(userRepository, times(1)).findById(userId);
        verify(jwtUtils, times(1)).validateToken(validCookie.getValue(), user);
    }

    @Test
    void isUserLoggedIn_WhenValidCookieDoesNotExist_ShouldThrowRuntimeException() {
        // Arrange
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getCookies()).thenReturn(null);

        // Act & Assert
        assertThrows(RuntimeException.class,
                () -> userService.isUserLoggedIn(request));
        verify(request, times(1)).getCookies();
        verify(jwtUtils, never()).extractId(anyString());
        verify(userRepository, never()).findById(anyLong());
        verify(jwtUtils, never()).validateToken(anyString(), any(User.class));
    }
    @Test
    void updateUser_WhenUserExists_ShouldReturnUpdatedUser() {
        // Arrange
        Long id = 1L;
        EditUser updatedUser = new EditUser();
        User existingUser = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(existingUser)).thenReturn(existingUser);

        // Act
        User result = userService.updateUser(updatedUser, id);

        // Assert
        assertNotNull(result);
        assertEquals(existingUser, result);
        verify(userRepository, times(1)).findById(id);
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void updateUser_WhenUserDoesNotExist_ShouldThrowEntityNotFoundException() {
        // Arrange
        Long id = 1L;
        EditUser updatedUser = new EditUser();
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class,
                () -> userService.updateUser(updatedUser, id));
        verify(userRepository, times(1)).findById(id);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        // Arrange
        List<User> users = new ArrayList<>();
        users.add(new User());
        users.add(new User());
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(users.size(), result.size());
        assertEquals(users, result);
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_WhenUserExists_ShouldReturnOptionalOfUser() {
        // Arrange
        Long id = 1L;
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        // Act
        Optional<User> result = userService.getUserById(id);

        // Assert
        assertNotNull(result);
        assertTrue(result.isPresent());
        assertEquals(user, result.get());
        verify(userRepository, times(1)).findById(id);
    }

    @Test
    void getUserById_WhenUserDoesNotExist_ShouldReturnEmptyOptional() {
        // Arrange
        Long id = 1L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.getUserById(id);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userRepository, times(1)).findById(id);
    }

    @Test
    void followUser_WhenFollowerAndFollowedExist_ShouldReturnFollowedMessage() {
        // Arrange
        Long followerId = 1L;
        Long followedId = 2L;
        User follower = new User();
        User followed = new User();
        follower.setId(followerId);
        followed.setId(followedId);
        when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
        when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));

        // Act
        String result = userService.followUser(followerId, followedId);

        // Assert
        assertNotNull(result);
        assertEquals("User " + follower.getName() + " followed " + followed.getName(), result);
        assertTrue(followed.getFollowers().contains(follower));
        verify(userRepository, times(1)).findById(followerId);
        verify(userRepository, times(1)).findById(followedId);
        verify(userRepository, times(1)).save(followed);
    }

    @Test
    void followUser_WhenFollowerAndFollowedExist_ShouldReturnUnfollowedMessage() {
        // Arrange
        Long followerId = 1L;
        Long followedId = 2L;
        User follower = new User();
        User followed = new User();
        follower.setId(followerId);
        followed.setId(followedId);
        follower.getFollowing().add(followed);
        followed.getFollowers().add(follower);
        when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
        when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));

        // Act
        String result = userService.followUser(followerId, followedId);

        // Assert
        assertNotNull(result);
        assertEquals("User " + follower.getName() + "   unfollowed " + followed.getName(), result);
        assertFalse(followed.getFollowers().contains(follower));
        verify(userRepository, times(1)).findById(followerId);
        verify(userRepository, times(1)).findById(followedId);
        verify(userRepository, times(1)).save(follower);
        verify(userRepository, times(1)).save(followed);
    }
    @Test
    void authenticate_WhenValidCredentials_ShouldReturnUser() {

        String email = "test@example.com";
        String password = "password";
        User user = new User();
        user.setPassword(password);
        user.setEmail(email);
        when(userRepository.findUserByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);


        User result = userService.authenticate(email, password);


        assertNotNull(result);
        assertEquals(user, result);
        verify(userRepository, times(1)).findUserByEmail(email);

    }

    @Test
    void authenticate_WhenInvalidCredentials_ShouldReturnNull() {
        // Arrange
        String email = "test@example.com";
        String password = "invalid_password";
        when(userRepository.findUserByEmail(email)).thenReturn(Optional.empty());

        // Act
        User result = userService.authenticate(email, password);

        // Assert
        assertNull(result);
        verify(userRepository, times(1)).findUserByEmail(email);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void findUsersByUsername_WhenNameExists_ShouldReturnListOfUsers() {
        // Arrange
        String name = "test";
        List<User> users = new ArrayList<>();
        users.add(new User());
        users.add(new User());
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.setName(name);
        when(userRepository.findByNameContainingIgnoreCase(name)).thenReturn(users);

        // Act
        List<User> result = userService.findUsersByUsername(searchRequest);

        // Assert
        assertNotNull(result);
        assertEquals(users.size(), result.size());
        assertEquals(users, result);
        verify(userRepository, times(1)).findByNameContainingIgnoreCase(name);
    }

    @Test
    void findUsersByUsername_WhenNameDoesNotExist_ShouldReturnNull() {
        // Arrange
        String name = "nonexistent";
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.setName(name);
        when(userRepository.findByNameContainingIgnoreCase(name)).thenReturn(null);

        // Act
        List<User> result = userService.findUsersByUsername(searchRequest);

        // Assert
        assertNull(result);
        verify(userRepository, times(1)).findByNameContainingIgnoreCase(name);
    }



}