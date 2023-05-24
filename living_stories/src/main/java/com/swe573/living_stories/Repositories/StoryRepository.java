package com.swe573.living_stories.Repositories;

import com.swe573.living_stories.Confrugation.DateParser;
import com.swe573.living_stories.Models.Story;
import com.swe573.living_stories.Requests.SearchRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    List<Story> findByUserId(Long user_id);


    List<Story> findByUserIdIn(List<Long> followingIds);
    @Query("SELECT s FROM Story s" +
            " WHERE" +
            " (:header IS NULL OR LOWER(s.header) LIKE CONCAT('%', :header, '%'))" +
            " AND (:userName IS NULL OR LOWER(s.user.name) LIKE CONCAT('%', LOWER(:userName), '%'))" +
            " AND (:text IS NULL OR LOWER(s.richText) LIKE CONCAT('%', LOWER(:text), '%'))" +
            " AND (:city IS NULL OR EXISTS (SELECT l FROM s.locations l WHERE LOWER(l.city) LIKE CONCAT('%', LOWER(:city), '%')))" +
            " AND (:country IS NULL OR EXISTS (SELECT l FROM s.locations l WHERE LOWER(l.country) LIKE CONCAT('%', LOWER(:country), '%')))" +
            " AND ((:latRangeMin IS NULL AND :latRangeMax IS NULL) OR EXISTS (SELECT l FROM s.locations l WHERE " +
            "   (l.lat BETWEEN :latRangeMin AND :latRangeMax) OR (l.lat IS NULL)))" +
            " AND ((:lngRangeMin IS NULL AND :lngRangeMax IS NULL) OR EXISTS (SELECT l FROM s.locations l WHERE " +
            "   (l.lng BETWEEN :lngRangeMin AND :lngRangeMax) OR (l.lng IS NULL)))" +
            " AND (:startSeason IS NULL OR s.startSeason = :startSeason)" +
            " AND (:endSeason IS NULL OR s.endSeason = :endSeason)")

    List<Story> search(
            @Param("header") String header,
            @Param("userName") String userName,
            @Param("city") String city,
            @Param("country") String country,
            @Param("text") String text,
            @Param("latRangeMin") Double latRangeMin,
            @Param("latRangeMax") Double latRangeMax,
            @Param("lngRangeMin") Double lngRangeMin,
            @Param("lngRangeMax") Double lngRangeMax,
            @Param("startSeason") String startSeason,
            @Param("endSeason") String endSeason

    );










}
