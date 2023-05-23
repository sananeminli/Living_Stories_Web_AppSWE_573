package com.swe573.living_stories.Repositories;

import com.swe573.living_stories.Models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {


}
