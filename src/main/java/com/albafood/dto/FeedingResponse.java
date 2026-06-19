package com.albafood.dto;

import com.albafood.entity.FeedingEntry;
import java.time.LocalDate;

public class FeedingResponse {

    private Long id;
    private LocalDate date;
    private String food;
    private String quantity;
    private String reaction;
    private String observations;

    public FeedingResponse() {}

    public FeedingResponse(Long id, LocalDate date, String food, String quantity, String reaction, String observations) {
        this.id = id;
        this.date = date;
        this.food = food;
        this.quantity = quantity;
        this.reaction = reaction;
        this.observations = observations;
    }

    public static FeedingResponse fromEntity(FeedingEntry entry) {
        return new FeedingResponse(
                entry.getId(),
                entry.getDate(),
                entry.getFood(),
                entry.getQuantity(),
                entry.getReaction(),
                entry.getObservations()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getFood() { return food; }
    public void setFood(String food) { this.food = food; }

    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }

    public String getReaction() { return reaction; }
    public void setReaction(String reaction) { this.reaction = reaction; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
}
