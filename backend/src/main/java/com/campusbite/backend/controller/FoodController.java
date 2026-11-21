package com.campusbite.backend.controller;

import com.campusbite.backend.dto.FoodDTO;
import com.campusbite.backend.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/foods", "/foods"})
public class FoodController {

    private final FoodService foodService;

    @Autowired
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    public ResponseEntity<List<FoodDTO>> getFoods(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {

        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(foodService.searchFoods(search.trim()));
        }

        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            return ResponseEntity.ok(foodService.getFoodsByCategory(category.trim()));
        }

        if (availableOnly) {
            return ResponseEntity.ok(foodService.getAvailableFoods());
        }

        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodDTO> getFoodById(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodById(id));
    }
}
