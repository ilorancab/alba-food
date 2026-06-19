package com.albafood.repository;

import com.albafood.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findAllByOrderByCategoryAscNameAsc();
}
