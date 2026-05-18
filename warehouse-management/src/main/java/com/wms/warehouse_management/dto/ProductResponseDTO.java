package com.wms.warehouse_management.dto;


public class ProductResponseDTO {

    private Long id;
    private String productName;
    private String skuCode;
    private Integer quantity;
    private Double price;
    private String category;

    public ProductResponseDTO() {
    }

    public ProductResponseDTO(Long id, String productName, String skuCode,
                              Integer quantity, Double price, String category) {
        this.id = id;
        this.productName = productName;
        this.skuCode = skuCode;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public String getProductName() {
        return productName;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getPrice() {
        return price;
    }

    public String getCategory() {
        return category;
    }
   
}