package com.albafood.service;

import com.albafood.entity.FeedingEntry;
import com.albafood.repository.FeedingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FeedingService {

    @Autowired
    private FeedingRepository feedingRepository;

    public List<FeedingEntry> getAllEntries() {
        return feedingRepository.findAll();
    }

    public List<FeedingEntry> getEntryByDate(LocalDate date) {
        return feedingRepository.findByDate(date);
    }

    public FeedingEntry saveOrUpdateEntry(FeedingEntry entry) {
        if (entry.getId() != null) {
            Optional<FeedingEntry> existing = feedingRepository.findById(entry.getId());
            if (existing.isPresent()) {
                FeedingEntry current = existing.get();
                current.setDate(entry.getDate());
                current.setFood(entry.getFood());
                current.setQuantity(entry.getQuantity());
                current.setReaction(entry.getReaction());
                current.setObservations(entry.getObservations());
                return feedingRepository.save(current);
            }
        }
        entry.setId(null);
        return feedingRepository.save(entry);
    }

    public void deleteEntry(Long id) {
        feedingRepository.deleteById(id);
    }
}
