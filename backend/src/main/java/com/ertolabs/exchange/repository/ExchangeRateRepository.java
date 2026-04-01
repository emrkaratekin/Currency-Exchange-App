package com.ertolabs.exchange.repository;

import com.ertolabs.exchange.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    Optional<ExchangeRate> findTopByCurrencyOrderByFetchedAtDesc(String currency);
    
    @Query("SELECT e FROM ExchangeRate e WHERE e.fetchedAt = (SELECT MAX(e2.fetchedAt) FROM ExchangeRate e2 WHERE e2.currency = e.currency)")
    List<ExchangeRate> findLatestRates();
}
