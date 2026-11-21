package com.campusbite.backend.controller;

import com.campusbite.backend.dto.AdminDashboardStatsDTO;
import com.campusbite.backend.dto.FoodDTO;
import com.campusbite.backend.dto.OrderResponseDTO;
import com.campusbite.backend.service.AdminService;
import com.campusbite.backend.service.FoodService;
import com.campusbite.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final FoodService foodService;
    private final OrderService orderService;
    private final AdminService adminService;

    @Autowired
    public AdminController(FoodService foodService, OrderService orderService, AdminService adminService) {
        this.foodService = foodService;
        this.orderService = orderService;
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // Food Management
    @PostMapping("/foods")
    public ResponseEntity<FoodDTO> addFood(@RequestBody FoodDTO foodDTO) {
        FoodDTO saved = foodService.addFood(foodDTO);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/foods/{id}")
    public ResponseEntity<FoodDTO> updateFood(@PathVariable Long id, @RequestBody FoodDTO foodDTO) {
        FoodDTO updated = foodService.updateFood(id, foodDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/foods/{id}")
    public ResponseEntity<Map<String, String>> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.ok(Map.of("message", "Food item deleted successfully", "id", id.toString()));
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> getAdminOrders(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.trim().isEmpty()) {
            throw new RuntimeException("Status field is required");
        }
        OrderResponseDTO updated = orderService.updateOrderStatus(id, status.trim());
        return ResponseEntity.ok(updated);
    }
}
