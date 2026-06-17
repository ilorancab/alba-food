package com.albafood.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "feeding_entries")
public class FeedingEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String food;

    private String quantity;

    private String reaction;

    @Column(columnDefinition = "TEXT")
    private String observations;

    // Getters and Setters
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
