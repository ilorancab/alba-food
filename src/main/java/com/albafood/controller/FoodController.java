package com.albafood.controller;

import com.albafood.dto.FoodTriedResponse;
import com.albafood.entity.FoodItem;
import com.albafood.service.FoodService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping("/tried")
    public List<FoodTriedResponse> getFoodsTried() {
        return foodService.getFoodsTried();
    }

    @GetMapping("/catalog")
    public List<FoodItem> getCatalog() {
        return foodService.getCatalog();
    }
}
