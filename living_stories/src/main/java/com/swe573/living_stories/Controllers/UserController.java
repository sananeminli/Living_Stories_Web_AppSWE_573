package com.swe573.living_stories.Controllers;

import com.swe573.living_stories.Models.User;
import com.swe573.living_stories.Services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User newUser = userService.createUser(user);
        return ResponseEntity.ok(newUser);
    }






    @PostMapping("/follow/{followingId}")
    public ResponseEntity<String> followUser( @PathVariable Long followingId, HttpServletRequest request) {
        Long userId = userService.isUserLoggedIn(request);
        String response  = userService.followUser(userId, followingId);
        return ResponseEntity.ok( response);
    }




    @PutMapping("/update")
    public ResponseEntity<User> updateUser(HttpServletRequest request, @RequestBody User user) {
        Long userId = userService.isUserLoggedIn(request);
        Optional<User> existingUser = userService.getUserById(userId);
        if (existingUser.isPresent()) {
            user.setId(userId);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getUserById(HttpServletRequest request) {
        Long userId = userService.isUserLoggedIn(request);
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        if (userService.deleteUserById(id)) {
            return ResponseEntity.ok("Done");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

