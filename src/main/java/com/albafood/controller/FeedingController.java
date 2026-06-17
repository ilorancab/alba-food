package com.albafood.controller;

import com.albafood.entity.FeedingEntry;
import com.albafood.service.FeedingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/feedings")
@CrossOrigin(origins = "*")
public class FeedingController {

    @Autowired
    private FeedingService feedingService;

    @GetMapping
    public List<FeedingEntry> getAll() {
        return feedingService.getAllEntries();
    }

    @GetMapping("/{date}")
    public List<FeedingEntry> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return feedingService.getEntryByDate(date);
    }

    @PostMapping
    public FeedingEntry save(@RequestBody FeedingEntry entry) {
        if (entry.getDate() == null) {
            entry.setDate(LocalDate.now());
        }
        return feedingService.saveOrUpdateEntry(entry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feedingService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}
