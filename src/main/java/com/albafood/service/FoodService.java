package com.albafood.service;

import com.albafood.dto.FoodTriedResponse;
import com.albafood.entity.FoodCategory;
import com.albafood.entity.FoodItem;
import com.albafood.repository.FeedingRepository;
import com.albafood.repository.FoodItemRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.*;
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
        List<FoodItem> catalog = foodItemRepository.findAll();
        List<String> catalogNames = catalog.stream()
                .map(item -> normalize(item.getName()))
                .collect(Collectors.toList());

        List<Object[]> raw = feedingRepository.findFoodsGrouped();
        Map<String, FoodTriedResponse> result = new LinkedHashMap<>();

        for (Object[] row : raw) {
            String rawName = (String) row[0];
            LocalDate lastDate = ((java.sql.Date) row[1]).toLocalDate();
            long count = (long) row[2];

            String normalized = normalize(rawName);
            FoodCategory category = matchCategory(normalized, catalogNames, catalog);

            String displayName = rawName.trim();
            String key = normalized;

            result.merge(key, new FoodTriedResponse(displayName, category, lastDate, (int) count),
                    (a, b) -> {
                        a.setLastDate(b.getLastDate().isAfter(a.getLastDate()) ? b.getLastDate() : a.getLastDate());
                        a.setTotalTimes(a.getTotalTimes() + b.getTotalTimes());
                        return a;
                    });
        }

        return new ArrayList<>(result.values());
    }

    public List<FoodItem> getCatalog() {
        return foodItemRepository.findAllByOrderByCategoryAscNameAsc();
    }

    private FoodCategory matchCategory(String foodName, List<String> catalogNames, List<FoodItem> catalog) {
        for (int i = 0; i < catalogNames.size(); i++) {
            if (foodName.contains(catalogNames.get(i))) {
                return catalog.get(i).getCategory();
            }
        }
        String singular = toSingular(foodName);
        if (!singular.equals(foodName)) {
            for (int i = 0; i < catalogNames.size(); i++) {
                if (singular.contains(catalogNames.get(i))) {
                    return catalog.get(i).getCategory();
                }
            }
        }
        return null;
    }

    private static String normalize(String s) {
        String lower = s.toLowerCase().trim();
        return Normalizer.normalize(lower, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}", "");
    }

    private static String toSingular(String s) {
        if (s.endsWith("ces")) {
            return s.substring(0, s.length() - 3) + "z";
        }
        if (s.endsWith("es")) {
            return s.substring(0, s.length() - 2);
        }
        if (s.endsWith("s")) {
            return s.substring(0, s.length() - 1);
        }
        return s;
    }
}
