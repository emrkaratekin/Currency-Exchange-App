package com.ertolabs.exchange.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "exchange_rates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String currency;
    
    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal rate;
    
    @Column(name = "fetched_at")
    private LocalDateTime fetchedAt;
    
    @PrePersist
    protected void onCreate() {
        fetchedAt = LocalDateTime.now();
    }
}
