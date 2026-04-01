package com.ertolabs.exchange.service;

import com.ertolabs.exchange.config.JwtUtil;
import com.ertolabs.exchange.dto.AuthResponse;
import com.ertolabs.exchange.dto.LoginRequest;
import com.ertolabs.exchange.dto.RegisterRequest;
import com.ertolabs.exchange.entity.User;
import com.ertolabs.exchange.entity.Wallet;
import com.ertolabs.exchange.repository.UserRepository;
import com.ertolabs.exchange.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    @Value("${app.default-balance}")
    private BigDecimal defaultBalance;
    
    @Value("${app.currencies}")
    private List<String> supportedCurrencies;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        
        userRepository.save(user);
        
        // Create PLN wallet with default balance
        Wallet plnWallet = Wallet.builder()
                .user(user)
                .currency("PLN")
                .balance(defaultBalance)
                .build();
        walletRepository.save(plnWallet);
        
        // Create empty wallets for supported currencies
        for (String currency : supportedCurrencies) {
            Wallet wallet = Wallet.builder()
                    .user(user)
                    .currency(currency)
                    .balance(BigDecimal.ZERO)
                    .build();
            walletRepository.save(wallet);
        }
        
        String token = jwtUtil.generateToken(user.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .message("Registration successful")
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(user.getEmail());
        
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .message("Login successful")
                .build();
    }
}
