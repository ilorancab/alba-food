package com.albafood.repository;

import com.albafood.entity.FeedingEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface FeedingRepository extends JpaRepository<FeedingEntry, Long> {
    List<FeedingEntry> findByDate(LocalDate date);

    @Query(value = """
        SELECT LOWER(TRIM(food)) AS name, MAX(date) AS last_date, COUNT(*) AS cnt
        FROM feeding_entries
        GROUP BY LOWER(TRIM(food))
        ORDER BY last_date DESC
        """, nativeQuery = true)
    List<Object[]> findFoodsGrouped();
}
