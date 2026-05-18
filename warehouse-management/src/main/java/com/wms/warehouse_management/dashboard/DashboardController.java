package com.wms.warehouse_management.dashboard;

import com.wms.warehouse_management.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.wms.warehouse_management.entity.Product;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/total-products")
    public long getTotalProducts() {

        return productRepository.count();
    }
    @GetMapping("/low-stock-products")
    public List<Product> getLowStockProducts() {

        return productRepository.findByQuantityLessThan(5);
    }
    @GetMapping("/total-inventory-value")
    public Double getTotalInventoryValue() {

        return productRepository.getTotalInventoryValue();
    }
    @GetMapping("/low-stock-count")
    public long getLowStockCount() {

        return productRepository.countByQuantityLessThan(5);
    }

    @GetMapping("/out-of-stock-count")
    public long getOutOfStockCount() {

        return productRepository.countByQuantity(0);
    }
}