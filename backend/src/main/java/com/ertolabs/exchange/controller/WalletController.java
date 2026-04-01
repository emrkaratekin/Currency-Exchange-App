package com.ertolabs.exchange.controller;

import com.ertolabs.exchange.dto.TopupRequest;
import com.ertolabs.exchange.dto.WalletDto;
import com.ertolabs.exchange.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {
    
    private final WalletService walletService;
    
    @GetMapping
    public ResponseEntity<List<WalletDto>> getWallets(Authentication auth) {
        return ResponseEntity.ok(walletService.getWallets(auth.getName()));
    }
    
    @PostMapping("/topup")
    public ResponseEntity<WalletDto> topup(Authentication auth, @Valid @RequestBody TopupRequest request) {
        return ResponseEntity.ok(walletService.topup(auth.getName(), request.getAmount()));
    }
}
