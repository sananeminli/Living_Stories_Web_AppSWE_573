package com.sanan.living_memories.Repositories;


import com.sanan.living_memories.Models.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    List<Story> findByUserId(Long user_id);

}