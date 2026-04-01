package com.ertolabs.exchange.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TopupRequest {
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Minimum top-up is 1 PLN")
    private BigDecimal amount;
}
