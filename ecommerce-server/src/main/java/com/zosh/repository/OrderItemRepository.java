package com.zosh.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.modal.OrderItem;
import com.zosh.modal.Product;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

	List<OrderItem> findByProduct(Product product);

}
