package com.campusbite.backend.service;

import com.campusbite.backend.dto.OrderRequestDTO;
import com.campusbite.backend.dto.OrderResponseDTO;
import com.campusbite.backend.model.Food;
import com.campusbite.backend.model.Order;
import com.campusbite.backend.model.OrderItem;
import com.campusbite.backend.model.User;
import com.campusbite.backend.repository.FoodRepository;
import com.campusbite.backend.repository.OrderRepository;
import com.campusbite.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, FoodRepository foodRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.foodRepository = foodRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO req) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new RuntimeException("Cart cannot be empty when creating an order");
        }

        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + req.getUserId()));

        String orderNumber = "CB-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + (1000 + ThreadLocalRandom.current().nextInt(9000));

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setStatus("Pending");

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderRequestDTO.OrderItemRequestDTO itemReq : req.getItems()) {
            if (itemReq.getQuantity() == null || itemReq.getQuantity() <= 0) {
                throw new RuntimeException("Quantity for all items must be greater than zero");
            }

            Food food = foodRepository.findById(itemReq.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food item not found with ID: " + itemReq.getFoodId()));

            if (Boolean.FALSE.equals(food.getAvailable())) {
                throw new RuntimeException("Food item '" + food.getName() + "' is currently unavailable and cannot be ordered");
            }

            BigDecimal unitPrice = food.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem(order, food, food.getName(), itemReq.getQuantity(), unitPrice, subtotal);
            orderItems.add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        return convertToResponseDTO(saved);
    }

    public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<OrderResponseDTO> getOrdersByStatus(String status) {
        if (status == null || status.equalsIgnoreCase("ALL")) {
            return getAllOrders();
        }
        return orderRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
        return convertToResponseDTO(order);
    }

    public OrderResponseDTO getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with Number: " + orderNumber));
        return convertToResponseDTO(order);
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // Valid statuses: Pending, Accepted, Preparing, Ready, Completed, Cancelled
        order.setStatus(newStatus);
        Order updated = orderRepository.save(order);
        return convertToResponseDTO(updated);
    }

    public OrderResponseDTO convertToResponseDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUser().getId());
        dto.setUserName(order.getUser().getName());
        dto.setUserEmail(order.getUser().getEmail());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getItems() != null) {
            List<OrderResponseDTO.OrderItemResponseDTO> itemDTOs = order.getItems().stream()
                    .map(item -> new OrderResponseDTO.OrderItemResponseDTO(
                            item.getId(),
                            item.getFood() != null ? item.getFood().getId() : null,
                            item.getFoodName(),
                            item.getFood() != null ? item.getFood().getImageUrl() : null,
                            item.getQuantity(),
                            item.getUnitPrice(),
                            item.getSubtotal()
                    ))
                    .collect(Collectors.toList());
            dto.setItems(itemDTOs);
        }

        return dto;
    }
}
