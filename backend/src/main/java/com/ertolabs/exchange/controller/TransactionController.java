package com.ertolabs.exchange.controller;

import com.ertolabs.exchange.dto.TransactionDto;
import com.ertolabs.exchange.dto.TransactionRequest;
import com.ertolabs.exchange.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<TransactionDto>> getTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getTransactions(auth.getName()));
    }
    
    @PostMapping
    public ResponseEntity<TransactionDto> executeTransaction(
            Authentication auth, 
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.executeTransaction(auth.getName(), request));
    }
}
