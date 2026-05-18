package com.wms.warehouse_management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String username;
    private String customerPhone;
    private String customerEmail;

    private String customerAddress;
    

    private String city;

    private String pincode;

    private String paymentMethod;

    private String productName;

    private Integer quantity;

    private String status;
    private String trackingId;

    private LocalDateTime orderDate;
    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(
    String trackingId
    ) {
        this.trackingId = trackingId;
    }
    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(
    String customerPhone
    ) {
        this.customerPhone = customerPhone;
    }
    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(
    String customerEmail
    ) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }
    

    public void setCustomerAddress(
    String customerAddress
    ) {
        this.customerAddress = customerAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(
    String pincode
    ) {
        this.pincode = pincode;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(
    String paymentMethod
    ) {
        this.paymentMethod = paymentMethod;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(
    String username
    ) {
        this.username = username;
    }

}
