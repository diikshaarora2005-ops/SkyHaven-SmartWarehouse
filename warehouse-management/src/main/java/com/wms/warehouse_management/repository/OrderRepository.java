package com.wms.warehouse_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.wms.warehouse_management.entity.Order;
import java.util.List;

public interface OrderRepository
extends JpaRepository<Order, Long> {
	List<Order> findByUsername(String username);

}