package com.campusbite.backend.dto;

import java.util.List;

public class AdminDashboardStatsDTO {
    private long totalFoods;
    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
    private List<OrderResponseDTO> recentOrders;

    public AdminDashboardStatsDTO() {}

    public AdminDashboardStatsDTO(long totalFoods, long totalOrders, long pendingOrders, long completedOrders, List<OrderResponseDTO> recentOrders) {
        this.totalFoods = totalFoods;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.completedOrders = completedOrders;
        this.recentOrders = recentOrders;
    }

    public long getTotalFoods() {
        return totalFoods;
    }

    public void setTotalFoods(long totalFoods) {
        this.totalFoods = totalFoods;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public List<OrderResponseDTO> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<OrderResponseDTO> recentOrders) {
        this.recentOrders = recentOrders;
    }
}
