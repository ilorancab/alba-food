package com.albafood.service;

import com.albafood.dto.FeedingRequest;
import com.albafood.dto.FeedingResponse;
import com.albafood.entity.FeedingEntry;
import com.albafood.repository.FeedingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Sort;
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

    public String exportCsv() {
        List<FeedingEntry> entries = feedingRepository.findAll(Sort.by(Sort.Direction.ASC, "date", "id"));

        StringBuilder csv = new StringBuilder("Fecha;Alimento;Cantidad;Reacción;Observaciones\r\n");
        for (FeedingEntry entry : entries) {
            csv.append(escapeCsv(entry.getDate().toString())).append(';')
                    .append(escapeCsv(entry.getFood())).append(';')
                    .append(escapeCsv(entry.getQuantity())).append(';')
                    .append(escapeCsv(entry.getReaction())).append(';')
                    .append(escapeCsv(entry.getObservations())).append("\r\n");
        }
        return csv.toString();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        if (value.contains(";") || value.contains("\"") || value.contains("\n") || value.contains("\r")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }

    private void applyRequest(FeedingEntry entry, FeedingRequest request) {
        entry.setDate(request.getDate());
        entry.setFood(request.getFood());
        entry.setQuantity(request.getQuantity());
        entry.setReaction(request.getReaction());
        entry.setObservations(request.getObservations());
    }
}
