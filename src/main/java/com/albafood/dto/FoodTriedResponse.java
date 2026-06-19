package com.albafood.dto;

import com.albafood.entity.FoodCategory;
import java.time.LocalDate;

public class FoodTriedResponse {

    private String name;
    private FoodCategory category;
    private LocalDate lastDate;
    private int totalTimes;

    public FoodTriedResponse() {}

    public FoodTriedResponse(String name, FoodCategory category, LocalDate lastDate, int totalTimes) {
        this.name = name;
        this.category = category;
        this.lastDate = lastDate;
        this.totalTimes = totalTimes;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public FoodCategory getCategory() { return category; }
    public void setCategory(FoodCategory category) { this.category = category; }

    public LocalDate getLastDate() { return lastDate; }
    public void setLastDate(LocalDate lastDate) { this.lastDate = lastDate; }

    public int getTotalTimes() { return totalTimes; }
    public void setTotalTimes(int totalTimes) { this.totalTimes = totalTimes; }
}
