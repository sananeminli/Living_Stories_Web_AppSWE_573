package com.swe573.living_stories.Repositories;

import com.swe573.living_stories.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserByEmail(String eMail);

    Optional<User> findByName(String name);
}