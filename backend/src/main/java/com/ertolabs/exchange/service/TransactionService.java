package com.ertolabs.exchange.service;

import com.ertolabs.exchange.dto.TransactionDto;
import com.ertolabs.exchange.dto.TransactionRequest;
import com.ertolabs.exchange.entity.Transaction;
import com.ertolabs.exchange.entity.TransactionType;
import com.ertolabs.exchange.entity.User;
import com.ertolabs.exchange.entity.Wallet;
import com.ertolabs.exchange.repository.TransactionRepository;
import com.ertolabs.exchange.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final ExchangeRateService exchangeRateService;
    
    public List<TransactionDto> getTransactions(String email) {
        User user = getUserByEmail(email);
        return transactionRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TransactionDto executeTransaction(String email, TransactionRequest request) {
        User user = getUserByEmail(email);
        TransactionType type = TransactionType.valueOf(request.getType().toUpperCase());
        String currency = request.getCurrency().toUpperCase();
        BigDecimal amount = request.getAmount();
        BigDecimal rate = exchangeRateService.getRateForCurrency(currency);
        
        Transaction transaction;
        
        if (type == TransactionType.BUY) {
            transaction = executeBuy(user, currency, amount, rate);
        } else if (type == TransactionType.SELL) {
            transaction = executeSell(user, currency, amount, rate);
        } else {
            throw new RuntimeException("Invalid transaction type");
        }
        
        return toDto(transaction);
    }
    
    private Transaction executeBuy(User user, String currency, BigDecimal foreignAmount, BigDecimal rate) {
        // BUY: User pays PLN to get foreign currency
        BigDecimal plnAmount = foreignAmount.multiply(rate).setScale(4, RoundingMode.HALF_UP);
        
        Wallet plnWallet = walletService.getWallet(user, "PLN");
        Wallet foreignWallet = walletService.getWallet(user, currency);
        
        if (plnWallet.getBalance().compareTo(plnAmount) < 0) {
            throw new RuntimeException("Insufficient PLN balance");
        }
        
        plnWallet.setBalance(plnWallet.getBalance().subtract(plnAmount));
        foreignWallet.setBalance(foreignWallet.getBalance().add(foreignAmount));
        
        walletService.saveWallet(plnWallet);
        walletService.saveWallet(foreignWallet);
        
        Transaction transaction = Transaction.builder()
                .user(user)
                .type(TransactionType.BUY)
                .fromCurrency("PLN")
                .toCurrency(currency)
                .fromAmount(plnAmount)
                .toAmount(foreignAmount)
                .exchangeRate(rate)
                .build();
        
        return transactionRepository.save(transaction);
    }
    
    private Transaction executeSell(User user, String currency, BigDecimal foreignAmount, BigDecimal rate) {
        // SELL: User sells foreign currency to get PLN
        BigDecimal plnAmount = foreignAmount.multiply(rate).setScale(4, RoundingMode.HALF_UP);
        
        Wallet plnWallet = walletService.getWallet(user, "PLN");
        Wallet foreignWallet = walletService.getWallet(user, currency);
        
        if (foreignWallet.getBalance().compareTo(foreignAmount) < 0) {
            throw new RuntimeException("Insufficient " + currency + " balance");
        }
        
        foreignWallet.setBalance(foreignWallet.getBalance().subtract(foreignAmount));
        plnWallet.setBalance(plnWallet.getBalance().add(plnAmount));
        
        walletService.saveWallet(plnWallet);
        walletService.saveWallet(foreignWallet);
        
        Transaction transaction = Transaction.builder()
                .user(user)
                .type(TransactionType.SELL)
                .fromCurrency(currency)
                .toCurrency("PLN")
                .fromAmount(foreignAmount)
                .toAmount(plnAmount)
                .exchangeRate(rate)
                .build();
        
        return transactionRepository.save(transaction);
    }
    
    private TransactionDto toDto(Transaction t) {
        return TransactionDto.builder()
                .id(t.getId())
                .type(t.getType().name())
                .fromCurrency(t.getFromCurrency())
                .toCurrency(t.getToCurrency())
                .fromAmount(t.getFromAmount())
                .toAmount(t.getToAmount())
                .exchangeRate(t.getExchangeRate())
                .createdAt(t.getCreatedAt())
                .build();
    }
    
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
