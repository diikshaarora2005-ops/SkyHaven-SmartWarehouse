package com.wms.warehouse_management.service;

import com.wms.warehouse_management.dto.ProductRequestDTO;
import com.wms.warehouse_management.dto.ProductResponseDTO;
import com.wms.warehouse_management.entity.Product;
import com.wms.warehouse_management.repository.ProductRepository;
import com.wms.warehouse_management.exception.ResourceNotFoundException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.wms.warehouse_management.exception.BadRequestException;



@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) {

        if (productRepository.existsBySkuCode(requestDTO.getSkuCode())) {
        	throw new BadRequestException("SKU Code already exists");
        }

        Product product = new Product();

        product.setProductName(requestDTO.getProductName());
        product.setSkuCode(requestDTO.getSkuCode());
        product.setQuantity(requestDTO.getQuantity());
        product.setPrice(requestDTO.getPrice());
        product.setCategory(requestDTO.getCategory());
        product.setImageUrl(requestDTO.getImageUrl());

        Product savedProduct = productRepository.save(product);

        return new ProductResponseDTO(
                savedProduct.getId(),
                savedProduct.getProductName(),
                savedProduct.getSkuCode(),
                savedProduct.getQuantity(),
                savedProduct.getPrice(),
                savedProduct.getCategory()
        );
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

public Product getProductById(Long id) {
    return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
}
public Product updateProduct(Long id, ProductRequestDTO requestDTO) {

    Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    product.setProductName(requestDTO.getProductName());
    product.setSkuCode(requestDTO.getSkuCode());
    product.setQuantity(requestDTO.getQuantity());
    product.setPrice(requestDTO.getPrice());
    product.setCategory(requestDTO.getCategory());
    product.setImageUrl(requestDTO.getImageUrl());

    return productRepository.save(product);
    }

public void deleteProduct(Long id) {

    Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    productRepository.delete(product);
}
public Page<Product> getProductsWithPagination(int page, int size) {

    Pageable pageable = PageRequest.of(page, size);

    return productRepository.findAll(pageable);
}
public List<Product> getProductsWithSorting(String field) {

    return productRepository.findAll(Sort.by(Sort.Direction.ASC, field));
}
public List<Product> searchProducts(String productName) {

    return productRepository
            .findByProductNameContainingIgnoreCase(productName);
}
public Page<Product> getProductsWithPaginationAndSorting(
        int page,
        int size,
        String field) {

    Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.ASC, field));

    return productRepository.findAll(pageable);
}
public List<Product> getLowStockProducts(Integer quantity) {

    return productRepository.findByQuantityLessThan(quantity);
}
}