package com.zosh.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.modal.Order;
import com.zosh.repository.OrderRepository;
import com.zosh.user.domain.OrderStatus;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        List<Order> allOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        
        // Filter out cancelled orders if needed, or count everything
        List<Order> validOrders = allOrders.stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .collect(Collectors.toList());

        // Calculate Totals
        double totalRevenue = validOrders.stream()
                .mapToDouble(Order::getTotalDiscountedPrice)
                .sum();
                
        int totalSales = validOrders.size();
        
        // Let's assume Customers are unique users from valid orders
        long totalCustomers = validOrders.stream()
                .map(o -> o.getUser().getId())
                .distinct()
                .count();

        int totalProductsSold = validOrders.stream()
                .mapToInt(Order::getTotalItem)
                .sum();

        // Calculate last 7 days sales graph data
        Map<String, Double> last7DaysSales = new TreeMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            last7DaysSales.put(today.minusDays(i).toString(), 0.0);
        }

        for (Order o : validOrders) {
            if (o.getOrderDate() != null) {
                String dateKey = o.getOrderDate().toString();
                if (last7DaysSales.containsKey(dateKey)) {
                    last7DaysSales.put(dateKey, last7DaysSales.get(dateKey) + o.getTotalDiscountedPrice());
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", totalRevenue);
        response.put("totalSales", totalSales);
        response.put("totalCustomers", totalCustomers);
        response.put("totalProducts", totalProductsSold);
        response.put("salesOverTime", last7DaysSales);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
