package com.albafood.controller;

import com.albafood.dto.FeedingRequest;
import com.albafood.dto.FeedingResponse;
import com.albafood.service.FeedingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
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

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv() {
        // BOM so Excel detects UTF-8
        byte[] body = ("\uFEFF" + feedingService.exportCsv()).getBytes(StandardCharsets.UTF_8);
        String filename = "historial_" + LocalDate.now() + ".csv";
        return ResponseEntity.ok()
                .header("Content-Disposition", ContentDisposition.attachment().filename(filename).build().toString())
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(body);
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
