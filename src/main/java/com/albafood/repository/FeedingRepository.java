package com.albafood.repository;

import com.albafood.entity.FeedingEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface FeedingRepository extends JpaRepository<FeedingEntry, Long> {
    List<FeedingEntry> findByDate(LocalDate date);
}
