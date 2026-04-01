package com.ertolabs.exchange.service;

import com.ertolabs.exchange.dto.WalletDto;
import com.ertolabs.exchange.entity.User;
import com.ertolabs.exchange.entity.Wallet;
import com.ertolabs.exchange.entity.Transaction;
import com.ertolabs.exchange.entity.TransactionType;
import com.ertolabs.exchange.repository.UserRepository;
import com.ertolabs.exchange.repository.WalletRepository;
import com.ertolabs.exchange.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {
    
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    
    public List<WalletDto> getWallets(String email) {
        User user = getUserByEmail(email);
        return walletRepository.findByUser(user).stream()
                .map(w -> WalletDto.builder()
                        .currency(w.getCurrency())
                        .balance(w.getBalance())
                        .build())
                .collect(Collectors.toList());
    }
    
    @Transactional
    public WalletDto topup(String email, BigDecimal amount) {
        User user = getUserByEmail(email);
        Wallet plnWallet = walletRepository.findByUserAndCurrency(user, "PLN")
                .orElseThrow(() -> new RuntimeException("PLN wallet not found"));
        
        plnWallet.setBalance(plnWallet.getBalance().add(amount));
        walletRepository.save(plnWallet);
        
        // Record transaction
        Transaction transaction = Transaction.builder()
                .user(user)
                .type(TransactionType.TOPUP)
                .fromCurrency("PLN")
                .toCurrency("PLN")
                .fromAmount(amount)
                .toAmount(amount)
                .exchangeRate(BigDecimal.ONE)
                .build();
        transactionRepository.save(transaction);
        
        return WalletDto.builder()
                .currency("PLN")
                .balance(plnWallet.getBalance())
                .build();
    }
    
    public Wallet getWallet(User user, String currency) {
        return walletRepository.findByUserAndCurrency(user, currency)
                .orElseThrow(() -> new RuntimeException("Wallet not found for currency: " + currency));
    }
    
    public void saveWallet(Wallet wallet) {
        walletRepository.save(wallet);
    }
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
