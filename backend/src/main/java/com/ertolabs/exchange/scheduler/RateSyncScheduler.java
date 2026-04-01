package com.ertolabs.exchange.scheduler;

import com.ertolabs.exchange.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateSyncScheduler {
    
    private final ExchangeRateService exchangeRateService;
    
    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        log.info("Fetching initial exchange rates...");
        exchangeRateService.fetchAndSaveRates();
    }
    
    @Scheduled(fixedRate = 900000) // Every 15 minutes
    public void syncRates() {
        log.info("Scheduled rate sync started...");
        exchangeRateService.fetchAndSaveRates();
    }
}
