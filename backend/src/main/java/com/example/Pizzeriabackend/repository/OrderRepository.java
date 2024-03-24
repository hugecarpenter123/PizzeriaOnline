package com.example.Pizzeriabackend.repository;

import com.example.Pizzeriabackend.entity.Order;
import com.example.Pizzeriabackend.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByLookupId(String lookupId);

    Collection<Order> findByStatusNotIn(Collection<OrderStatus> statuses);

}
