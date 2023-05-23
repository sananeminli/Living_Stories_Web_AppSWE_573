package com.swe573.living_stories.Services;

import com.swe573.living_stories.Confrugation.JwtUtils;
import com.swe573.living_stories.Models.User;
import com.swe573.living_stories.Repositories.UserRepository;
import com.swe573.living_stories.Requests.EditUser;
import com.swe573.living_stories.Requests.SearchRequest;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;



    public User createUser(User user) {

        return userRepository.save(user);
    }

    public User profilePage( String username){
        Optional<User> optionalUser = userRepository.findByName(username);
        return optionalUser.orElse(null);
    }


    public Long isUserLoggedIn(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt_Token".equals(cookie.getName())) {
                    String cookieValue = cookie.getValue();
                    try{

                        Long id = jwtUtils.extractId(cookieValue);
                        System.out.println(id);
                        Optional<User> optionalUser =  userRepository.findById(id);
                        if (optionalUser.isPresent()){
                            User user = optionalUser.get();
                            if (jwtUtils.validateToken(cookieValue,user)){
                                return id;
                            }
                        }

                    }
                    catch (Exception e){
                        throw new EntityNotFoundException(e);
                    }

                }
            }


        }throw new RuntimeException(" User Not Logged In");


    }

    public User getUserByEmail(String email ){
        Optional<User> optionalUser = userRepository.findUserByEmail(email);
        if (optionalUser.isPresent()) {
           return optionalUser.get();

        }
        return null;

    }
    public boolean checkCredentials(String email , String password){
        Optional<User> optionalUser = userRepository.findUserByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            if (user.getPassword().equals(password)){
                return true;
            }
        }
        return false;
    }

    public User updateUser(EditUser updatedUser , Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        if (updatedUser.getPhoto()!= null){
            existingUser.setPhoto(updatedUser.getPhoto());
        }

        if (updatedUser.getBiography() != null) {
            existingUser.setBiography(updatedUser.getBiography());
        }

        if(updatedUser.getPassword() != null){
            existingUser.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(existingUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    public String followUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + followerId + " not found"));
        User followed = userRepository.findById(followedId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + followedId + " not found"));
        if(followed.getFollowers().contains(follower)){
            follower.getFollowing().remove(followed);
            followed.getFollowers().remove(follower);
            userRepository.save(follower);
            userRepository.save(followed);
            return "User "+ follower.getName()+"   unfollowed " + followed.getName();


        }
        else{
        followed.getFollowers().add(follower);
        userRepository.save(followed);
        return "User " +follower.getName()+ " followed " + followed.getName();
        }
    }




    public boolean deleteUserById(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            userRepository.deleteById(id);

            return true;
        } else {
            return false;
        }
    }


    public User authenticate(String email, String password) {
        Optional<User> optionalUser = userRepository.findUserByEmail(email);
        if (optionalUser.isPresent()){
            User user = optionalUser.get();
            if (user.getPassword().equals(password)){
                return user;
            }

        }
        return null;
    }

    public List<User> findUsersByUsername(SearchRequest searchRequest){
        if (searchRequest.getName()==null) return null;
        return  userRepository.findByNameContainingIgnoreCase(searchRequest.getName());
    }
}
