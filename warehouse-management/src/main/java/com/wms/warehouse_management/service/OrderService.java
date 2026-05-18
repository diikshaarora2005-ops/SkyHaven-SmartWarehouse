package com.wms.warehouse_management.service;

import com.wms.warehouse_management.entity.Order;
import com.wms.warehouse_management.entity.Product;
import com.wms.warehouse_management.exception.ResourceNotFoundException;
import com.wms.warehouse_management.repository.OrderRepository;
import com.wms.warehouse_management.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EmailService emailService;

    public Order createOrder(Order order){

        order.setStatus("Pending");

        order.setTrackingId(
            "TRK" + System.currentTimeMillis()
        );

        order.setOrderDate(
            java.time.LocalDateTime.now()
        );

        Product product =
            productRepository
            .findByProductName(
                order.getProductName()
            )
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Product not found"
                )
            );

        product.setQuantity(
            product.getQuantity() -
            order.getQuantity()
        );

        productRepository.save(product);

        Order savedOrder =
            orderRepository.save(order);

        emailService.sendOrderEmail(
            order.getCustomerEmail(),
            order.getCustomerName(),
            order.getTrackingId()
        );

        return savedOrder;
    }

    public java.util.List<Order> getAllOrders() {

        return orderRepository.findAll();

    }

    public Order updateOrderStatus(
        Long id,
        String status
    ){

        Order order =
            orderRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Order not found"
                )
            );

        order.setStatus(status);

        emailService.sendStatusUpdateEmail(
            order.getCustomerEmail(),
            order.getCustomerName(),
            status,
            order.getTrackingId()
        );

        return orderRepository.save(order);

    }

    public java.util.List<Order>
    getOrdersByUsername(
        String username
    ){

        return orderRepository
            .findByUsername(username);

    }

}