package com.ertolabs.exchange.service;

import com.ertolabs.exchange.dto.ExchangeRateDto;
import com.ertolabs.exchange.entity.ExchangeRate;
import com.ertolabs.exchange.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExchangeRateService {
    
    private final ExchangeRateRepository exchangeRateRepository;
    
    @Value("${nbp.api.url}")
    private String nbpApiUrl;
    
    @Value("${app.currencies}")
    private List<String> supportedCurrencies;
    
    public List<ExchangeRateDto> getLatestRates() {
        return exchangeRateRepository.findLatestRates().stream()
                .map(rate -> ExchangeRateDto.builder()
                        .currency(rate.getCurrency())
                        .rate(rate.getRate())
                        .fetchedAt(rate.getFetchedAt())
                        .build())
                .collect(Collectors.toList());
    }
    
    public BigDecimal getRateForCurrency(String currency) {
        return exchangeRateRepository.findTopByCurrencyOrderByFetchedAtDesc(currency)
                .map(ExchangeRate::getRate)
                .orElseThrow(() -> new RuntimeException("Rate not found for currency: " + currency));
    }
    
    @SuppressWarnings("unchecked")
    public void fetchAndSaveRates() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            List<Map<String, Object>> response = restTemplate.getForObject(nbpApiUrl, List.class);
            
            if (response != null && !response.isEmpty()) {
                Map<String, Object> table = response.get(0);
                List<Map<String, Object>> rates = (List<Map<String, Object>>) table.get("rates");
                
                for (Map<String, Object> rateData : rates) {
                    String code = (String) rateData.get("code");
                    
                    if (supportedCurrencies.contains(code)) {
                        BigDecimal rate = new BigDecimal(rateData.get("mid").toString());
                        
                        ExchangeRate exchangeRate = ExchangeRate.builder()
                                .currency(code)
                                .rate(rate)
                                .build();
                        
                        exchangeRateRepository.save(exchangeRate);
                        log.info("Saved rate for {}: {}", code, rate);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch rates from NBP API", e);
        }
    }
}
