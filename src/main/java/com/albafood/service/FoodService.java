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
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FoodService {

    private static final Set<String> STOP_WORDS = Set.of("con", "y", "e", "de", "en", "sin", "la", "el", "los", "las", "un", "una", "al", "del", "su");
    private static final List<String> PREFIXES = List.of("pure de ", "puré de ", "crema de ", "tritura de ", "papilla de ", "triturado de ");
    private static final Comparator<Map.Entry<String, FoodCategory>> BY_KEY_LENGTH =
            Comparator.<Map.Entry<String, FoodCategory>, Integer>comparing(e -> e.getKey().length()).reversed();

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

    private Stream<FoodTriedResponse> extractFoods(String foodText, LocalDate date, Map<String, FoodCategory> catalog) {
        String normalized = normalize(foodText);
        for (String prefix : PREFIXES) {
            if (normalized.startsWith(prefix)) {
                normalized = normalized.substring(prefix.length());
            }
        }

        List<Map.Entry<String, FoodCategory>> matches = new ArrayList<>();
        String remaining = matchCompounds(normalized, catalog, matches);
        tokenize(remaining).forEach(t -> matchSimple(t, catalog, matches));

        return matches.stream()
                .distinct()
                .map(m -> new FoodTriedResponse(m.getKey(), m.getValue(), date, 1));
    }

    private String matchCompounds(String text, Map<String, FoodCategory> catalog, List<Map.Entry<String, FoodCategory>> matches) {
        List<Map.Entry<String, FoodCategory>> compounds = catalog.entrySet().stream()
                .filter(e -> e.getKey().contains(" "))
                .sorted(BY_KEY_LENGTH)
                .toList();

        String result = text;
        for (Map.Entry<String, FoodCategory> entry : compounds) {
            int idx = result.indexOf(entry.getKey());
            if (idx != -1) {
                matches.add(entry);
                result = result.substring(0, idx) + result.substring(idx + entry.getKey().length());
            }
        }
        return result;
    }

    private void matchSimple(String token, Map<String, FoodCategory> catalog, List<Map.Entry<String, FoodCategory>> matches) {
        FoodCategory cat = catalog.get(token);
        if (cat != null) { matches.add(Map.entry(token, cat)); return; }

        String singular = !token.endsWith("s") ? null : token.substring(0, token.length() - 1);
        if (singular != null) {
            cat = catalog.get(singular);
            if (cat != null) { matches.add(Map.entry(singular, cat)); return; }
        }

        for (Map.Entry<String, FoodCategory> e : catalog.entrySet()) {
            if (token.contains(e.getKey()) || e.getKey().contains(token)) {
                matches.add(Map.entry(e.getKey(), e.getValue()));
                return;
            }
        }

        if (singular != null) {
            for (Map.Entry<String, FoodCategory> e : catalog.entrySet()) {
                if (singular.contains(e.getKey()) || e.getKey().contains(singular)) {
                    matches.add(Map.entry(e.getKey(), e.getValue()));
                    return;
                }
            }
        }
    }

    private List<String> tokenize(String text) {
        return Arrays.stream(text.split("[,/&;]|\\s+(y|e|con)\\s+|\\s+"))
                .map(String::trim)
                .filter(t -> !t.isEmpty() && !STOP_WORDS.contains(t))
                .distinct()
                .toList();
    }

    private FoodTriedResponse merge(FoodTriedResponse a, FoodTriedResponse b) {
        if (b.getLastDate().isAfter(a.getLastDate())) {
            a.setLastDate(b.getLastDate());
        }
        a.setTotalTimes(a.getTotalTimes() + b.getTotalTimes());
        return a;
    }

    private static String normalize(String s) {
        return Normalizer.normalize(s.toLowerCase().trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}", "");
    }
}
