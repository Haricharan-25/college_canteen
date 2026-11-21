package com.campusbite.backend.repository;

import com.campusbite.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStatusOrderByCreatedAtDesc(String status);
    Optional<Order> findByOrderNumber(String orderNumber);

    long countByStatus(String status);

    @Query("SELECT COUNT(o) FROM Order o")
    long countTotalOrders();
}
