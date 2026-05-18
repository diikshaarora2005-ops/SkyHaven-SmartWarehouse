package com.wms.warehouse_management.controller;

import com.wms.warehouse_management.dto.ProductRequestDTO;
import com.wms.warehouse_management.dto.ProductResponseDTO;
import com.wms.warehouse_management.service.ProductService;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.wms.warehouse_management.entity.Product;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")

public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ProductResponseDTO createProduct(
    		@Valid @RequestBody ProductRequestDTO requestDTO) {

        return productService.createProduct(requestDTO);
    }

@GetMapping
public List<Product> getAllProducts() {
    return productService.getAllProducts();
}
@GetMapping("/{id}")
public Product getProductById(@PathVariable Long id) {
    return productService.getProductById(id);
}
@PutMapping("/{id}")
public Product updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody ProductRequestDTO requestDTO) {

    return productService.updateProduct(id, requestDTO);
}



@DeleteMapping("/{id}")
public ResponseEntity<String> deleteProduct(@PathVariable Long id) {

    productService.deleteProduct(id);

    return ResponseEntity.ok("Product deleted successfully");
}
@GetMapping("/pagination")
public Page<Product> getProductsWithPagination(
        @RequestParam int page,
        @RequestParam int size) {

    return productService.getProductsWithPagination(page, size);
}
@GetMapping("/sort")
public List<Product> getProductsWithSorting(
        @RequestParam String field) {

    return productService.getProductsWithSorting(field);
}
@GetMapping("/search/{name}")
public List<Product> searchProducts(
        @PathVariable String name) {

    return productService.searchProducts(name);
}
@GetMapping("/paginationAndSort")
public Page<Product> getProductsWithPaginationAndSorting(
        @RequestParam int page,
        @RequestParam int size,
        @RequestParam String field) {

    return productService
            .getProductsWithPaginationAndSorting(page, size, field);
}
@GetMapping("/low-stock/{quantity}")
public List<Product> getLowStockProducts(
        @PathVariable Integer quantity) {

    return productService.getLowStockProducts(quantity);
}
}