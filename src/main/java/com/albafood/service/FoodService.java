package com.albafood.service;

import com.albafood.dto.FoodTriedResponse;
import com.albafood.entity.FoodCategory;
import com.albafood.entity.FoodItem;
import com.albafood.repository.FeedingRepository;
import com.albafood.repository.FoodItemRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class FoodService {

    private final FeedingRepository feedingRepository;
    private final FoodItemRepository foodItemRepository;

    public FoodService(FeedingRepository feedingRepository, FoodItemRepository foodItemRepository) {
        this.feedingRepository = feedingRepository;
        this.foodItemRepository = foodItemRepository;
    }

    public List<FoodTriedResponse> getFoodsTried() {
        Map<String, FoodCategory> catalog = foodItemRepository.findAll().stream()
                .collect(Collectors.toMap(
                        item -> normalize(item.getName()),
                        FoodItem::getCategory,
                        (a, b) -> a));

        return feedingRepository.findFoodsGrouped().stream()
                .map(this::toFoodTriedResponse)
                .collect(Collectors.toMap(
                        r -> normalize(r.getName()),
                        Function.identity(),
                        this::merge,
                        LinkedHashMap::new))
                .values().stream()
                .peek(r -> r.setCategory(resolveCategory(normalize(r.getName()), catalog)))
                .toList();
    }

    public List<FoodItem> getCatalog() {
        return foodItemRepository.findAllByOrderByCategoryAscNameAsc();
    }

    private FoodTriedResponse toFoodTriedResponse(Object[] row) {
        return new FoodTriedResponse(
                ((String) row[0]).trim(),
                null,
                ((java.sql.Date) row[1]).toLocalDate(),
                ((Long) row[2]).intValue());
    }

    private FoodTriedResponse merge(FoodTriedResponse a, FoodTriedResponse b) {
        a.setLastDate(b.getLastDate().isAfter(a.getLastDate()) ? b.getLastDate() : a.getLastDate());
        a.setTotalTimes(a.getTotalTimes() + b.getTotalTimes());
        return a;
    }

    private FoodCategory resolveCategory(String normalized, Map<String, FoodCategory> catalog) {
        return catalog.entrySet().stream()
                .filter(e -> normalized.contains(e.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }

    private static String normalize(String s) {
        return Normalizer.normalize(s.toLowerCase().trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}", "");
    }
}
