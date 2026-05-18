package com.wms.warehouse_management.controller;

import com.wms.warehouse_management.entity.Order;
import com.wms.warehouse_management.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @PostMapping
    public Order createOrder(
            @RequestBody Order order
    ) {
        return orderService.createOrder(order);
    }
    @GetMapping
    public List<Order> getAllOrders() {

        return orderService.getAllOrders();

    }
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(
    @PathVariable Long id,
    @RequestParam String status
    ){
        return orderService
        .updateOrderStatus(id, status);
    }
    @GetMapping("/user/{username}")
    public List<Order>
    getOrdersByUsername(
    @PathVariable String username
    ){

    return orderService
    .getOrdersByUsername(username);

    }

}
