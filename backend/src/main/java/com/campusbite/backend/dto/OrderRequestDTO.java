package com.campusbite.backend.dto;

import java.util.List;

public class OrderRequestDTO {
    private Long userId;
    private List<OrderItemRequestDTO> items;

    public static class OrderItemRequestDTO {
        private Long foodId;
        private Integer quantity;

        public OrderItemRequestDTO() {}

        public OrderItemRequestDTO(Long foodId, Integer quantity) {
            this.foodId = foodId;
            this.quantity = quantity;
        }

        public Long getFoodId() {
            return foodId;
        }

        public void setFoodId(Long foodId) {
            this.foodId = foodId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public OrderRequestDTO() {}

    public OrderRequestDTO(Long userId, List<OrderItemRequestDTO> items) {
        this.userId = userId;
        this.items = items;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItemRequestDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequestDTO> items) {
        this.items = items;
    }
}
