package com.albafood.service;

import com.albafood.dto.FeedingRequest;
import com.albafood.dto.FeedingResponse;
import com.albafood.entity.FeedingEntry;
import com.albafood.repository.FeedingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FeedingService {

    private final FeedingRepository feedingRepository;

    public FeedingService(FeedingRepository feedingRepository) {
        this.feedingRepository = feedingRepository;
    }

    public List<FeedingResponse> getAllEntries() {
        return feedingRepository.findAll()
                .stream()
                .map(FeedingResponse::fromEntity)
                .toList();
    }

    public List<FeedingResponse> getEntryByDate(LocalDate date) {
        return feedingRepository.findByDate(date)
                .stream()
                .map(FeedingResponse::fromEntity)
                .toList();
    }

    public FeedingResponse createEntry(FeedingRequest request) {
        FeedingEntry entry = new FeedingEntry();
        applyRequest(entry, request);
        return FeedingResponse.fromEntity(feedingRepository.save(entry));
    }

    public FeedingResponse updateEntry(Long id, FeedingRequest request) {
        FeedingEntry entry = feedingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("FeedingEntry not found with id: " + id));
        applyRequest(entry, request);
        return FeedingResponse.fromEntity(feedingRepository.save(entry));
    }

    public void deleteEntry(Long id) {
        feedingRepository.deleteById(id);
    }

    private void applyRequest(FeedingEntry entry, FeedingRequest request) {
        entry.setDate(request.getDate());
        entry.setFood(request.getFood());
        entry.setQuantity(request.getQuantity());
        entry.setReaction(request.getReaction());
        entry.setObservations(request.getObservations());
    }
}
