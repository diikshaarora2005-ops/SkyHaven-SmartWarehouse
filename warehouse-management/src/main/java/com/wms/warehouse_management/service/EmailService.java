package com.wms.warehouse_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderEmail(
            String toEmail,
            String customerName,
            String trackingId
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Order Confirmed - Smart Warehouse"
        );

        message.setText(
                "Hello " + customerName +
                ",\n\nYour order has been placed successfully." +
                "\nTracking ID: " + trackingId +
                "\n\nThank you for shopping with us!"
        );

        mailSender.send(message);
    }
    public void sendStatusUpdateEmail(
            String toEmail,
            String customerName,
            String status,
            String trackingId
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Order Status Updated - Smart Warehouse"
        );

        message.setText(
                "Hello " + customerName +
                ",\n\nYour order status is now: "
                + status +
                "\nTracking ID: " + trackingId +
                "\n\nThank you for shopping with us!"
        );

        mailSender.send(message);
    }
}