package com.campusbite.backend.service;

import com.campusbite.backend.dto.FoodDTO;
import com.campusbite.backend.model.Food;
import com.campusbite.backend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    @Autowired
    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<FoodDTO> getAllFoods() {
        return foodRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FoodDTO> getAvailableFoods() {
        return foodRepository.findByAvailableTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FoodDTO getFoodById(Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with ID: " + id));
        return convertToDTO(food);
    }

    public List<FoodDTO> getFoodsByCategory(String category) {
        return foodRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FoodDTO> searchFoods(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FoodDTO addFood(FoodDTO dto) {
        Food food = new Food();
        food.setName(dto.getName());
        food.setDescription(dto.getDescription());
        food.setPrice(dto.getPrice());
        food.setCategory(dto.getCategory());
        food.setImageUrl(dto.getImageUrl());
        food.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);

        Food saved = foodRepository.save(food);
        return convertToDTO(saved);
    }

    @Transactional
    public FoodDTO updateFood(Long id, FoodDTO dto) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with ID: " + id));

        food.setName(dto.getName());
        food.setDescription(dto.getDescription());
        food.setPrice(dto.getPrice());
        food.setCategory(dto.getCategory());
        food.setImageUrl(dto.getImageUrl());
        if (dto.getAvailable() != null) {
            food.setAvailable(dto.getAvailable());
        }

        Food updated = foodRepository.save(food);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new RuntimeException("Food item not found with ID: " + id);
        }
        foodRepository.deleteById(id);
    }

    public FoodDTO convertToDTO(Food food) {
        return new FoodDTO(
                food.getId(),
                food.getName(),
                food.getDescription(),
                food.getPrice(),
                food.getCategory(),
                food.getImageUrl(),
                food.getAvailable()
        );
    }
}
