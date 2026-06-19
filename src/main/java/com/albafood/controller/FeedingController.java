package com.albafood.controller;

import com.albafood.dto.FeedingRequest;
import com.albafood.dto.FeedingResponse;
import com.albafood.service.FeedingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/feedings")
public class FeedingController {

    private final FeedingService feedingService;

    public FeedingController(FeedingService feedingService) {
        this.feedingService = feedingService;
    }

    @GetMapping
    public List<FeedingResponse> getAll() {
        return feedingService.getAllEntries();
    }

    @GetMapping("/{date}")
    public List<FeedingResponse> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return feedingService.getEntryByDate(date);
    }

    @PostMapping
    public ResponseEntity<FeedingResponse> create(@Valid @RequestBody FeedingRequest request) {
        FeedingResponse response = feedingService.createEntry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public FeedingResponse update(@PathVariable Long id, @Valid @RequestBody FeedingRequest request) {
        return feedingService.updateEntry(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feedingService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}
