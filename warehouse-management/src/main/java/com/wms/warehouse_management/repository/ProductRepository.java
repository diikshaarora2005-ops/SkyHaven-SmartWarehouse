package com.wms.warehouse_management.repository;

import com.wms.warehouse_management.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;



public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySkuCode(String skuCode);
    Optional<Product> findByProductName(String productName);

    boolean existsBySkuCode(String skuCode);

Optional<Product> findById(Long id);
List<Product> findByProductNameContainingIgnoreCase(String productName);
List<Product> findByQuantityLessThan(Integer quantity);
List<Product> findByQuantityLessThan(int quantity);
@Query("SELECT SUM(p.price * p.quantity) FROM Product p")
Double getTotalInventoryValue();
long countByQuantityLessThan(int quantity);

long countByQuantity(int quantity);
}