package com.albafood.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class FeedingRequest {

    @NotNull
    private LocalDate date;

    @NotBlank
    private String food;

    private String quantity;

    private String reaction;

    private String observations;

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
