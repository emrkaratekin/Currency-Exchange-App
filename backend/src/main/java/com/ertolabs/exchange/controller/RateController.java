package com.ertolabs.exchange.controller;

import com.ertolabs.exchange.dto.ExchangeRateDto;
import com.ertolabs.exchange.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rates")
@RequiredArgsConstructor
public class RateController {
    
    private final ExchangeRateService exchangeRateService;
    
    @GetMapping
    public ResponseEntity<List<ExchangeRateDto>> getRates() {
        return ResponseEntity.ok(exchangeRateService.getLatestRates());
    }
}
