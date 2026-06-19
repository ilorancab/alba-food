package com.albafood.service;

import com.albafood.config.FoodProperties;
import com.albafood.dto.FoodTriedResponse;
import com.albafood.entity.FoodCategory;
import com.albafood.entity.FoodItem;
import com.albafood.repository.FeedingRepository;
import com.albafood.repository.FoodItemRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class FoodService {

    private final FeedingRepository feedingRepository;
    private final FoodItemRepository foodItemRepository;
    private final FoodProperties foodProperties;

    public FoodService(FeedingRepository feedingRepository, FoodItemRepository foodItemRepository, FoodProperties foodProperties) {
        this.feedingRepository = feedingRepository;
        this.foodItemRepository = foodItemRepository;
        this.foodProperties = foodProperties;
    }

    public List<FoodTriedResponse> getFoodsTried() {
        Map<String, FoodCategory> catalog = foodItemRepository.findAll().stream()
                .collect(Collectors.toMap(
                        item -> normalize(item.getName()),
                        FoodItem::getCategory,
                        (a, b) -> a));

        return feedingRepository.findAll().stream()
                .flatMap(entry -> extractFoods(entry.getFood(), entry.getDate(), catalog))
                .collect(Collectors.toMap(
                        FoodTriedResponse::getName,
                        Function.identity(),
                        this::merge,
                        LinkedHashMap::new))
                .values().stream()
                .sorted(Comparator.comparing(FoodTriedResponse::getLastDate).reversed())
                .toList();
    }

    public List<FoodItem> getCatalog() {
        return foodItemRepository.findAllByOrderByCategoryAscNameAsc();
    }

    private java.util.stream.Stream<FoodTriedResponse> extractFoods(String foodText, LocalDate date, Map<String, FoodCategory> catalog) {
        String text = normalize(foodText);
        for (String prefix : foodProperties.getPrefixes()) {
            String p = normalize(prefix);
            if (text.startsWith(p)) {
                text = text.substring(p.length());
                break;
            }
        }

        List<FoodMatch> matches = new ArrayList<>();
        text = matchCompounds(text, catalog, matches);
        tokenize(text).forEach(t -> matchSimple(t, catalog, matches));

        return matches.stream()
                .distinct()
                .map(m -> new FoodTriedResponse(m.name, m.category, date, 1));
    }

    private String matchCompounds(String text, Map<String, FoodCategory> catalog, List<FoodMatch> matches) {
        List<Map.Entry<String, FoodCategory>> compounds = catalog.entrySet().stream()
                .filter(e -> e.getKey().contains(" "))
                .sorted(Comparator.<Map.Entry<String, FoodCategory>, Integer>comparing(e -> e.getKey().length()).reversed())
                .toList();

        String remaining = text;
        for (var entry : compounds) {
            int idx = remaining.indexOf(entry.getKey());
            if (idx != -1) {
                matches.add(new FoodMatch(entry.getKey(), entry.getValue()));
                remaining = remaining.substring(0, idx) + remaining.substring(idx + entry.getKey().length());
            }
        }
        return remaining;
    }

    private void matchSimple(String token, Map<String, FoodCategory> catalog, List<FoodMatch> matches) {
        FoodCategory cat = catalog.get(token);
        if (cat != null) {
            matches.add(new FoodMatch(token, cat));
            return;
        }
        for (var e : catalog.entrySet()) {
            if (token.contains(e.getKey())) {
                matches.add(new FoodMatch(e.getKey(), e.getValue()));
                return;
            }
        }
    }

    private List<String> tokenize(String text) {
        return Arrays.stream(text.split("[,/&;]|\\s+(y|e|con)\\s+|\\s+"))
                .map(String::trim)
                .filter(t -> !t.isEmpty() && !foodProperties.getStopWords().contains(t))
                .distinct()
                .toList();
    }

    private FoodTriedResponse merge(FoodTriedResponse a, FoodTriedResponse b) {
        if (b.getLastDate().isAfter(a.getLastDate())) a.setLastDate(b.getLastDate());
        a.setTotalTimes(a.getTotalTimes() + b.getTotalTimes());
        return a;
    }

    private static String normalize(String s) {
        return Normalizer.normalize(s.toLowerCase().trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}", "");
    }

    private record FoodMatch(String name, FoodCategory category) {}
}
