package com.campusbite.backend.service;

import com.campusbite.backend.dto.AdminDashboardStatsDTO;
import com.campusbite.backend.dto.OrderResponseDTO;
import com.campusbite.backend.repository.FoodRepository;
import com.campusbite.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Autowired
    public AdminService(FoodRepository foodRepository, OrderRepository orderRepository, OrderService orderService) {
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public AdminDashboardStatsDTO getDashboardStats() {
        long totalFoods = foodRepository.count();
        long totalOrders = orderRepository.countTotalOrders();
        long pendingOrders = orderRepository.countByStatus("Pending");
        long completedOrders = orderRepository.countByStatus("Completed");

        List<OrderResponseDTO> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(orderService::convertToResponseDTO)
                .collect(Collectors.toList());

        return new AdminDashboardStatsDTO(
                totalFoods,
                totalOrders,
                pendingOrders,
                completedOrders,
                recentOrders
        );
    }
}
