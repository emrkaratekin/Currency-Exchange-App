# Currency Exchange App - Frontend

A cross-platform currency exchange application built with React Native and Expo. Trade currencies, manage your wallet, and track transaction history.

## 🚀 Tech Stack

- **React Native** with **Expo SDK 50**
- **React 18.2.0** & **React Native 0.73.6**
- **React Navigation** for navigation
- **Axios** for API requests
- **AsyncStorage** for token persistence
- **Docker** for containerized deployment
- **Nginx** for web serving

## 📋 Prerequisites

- **Node.js 18+** (Required for current setup)
- **npm** or **yarn**
- **Docker & Docker Compose** (for containerized deployment)
- **Expo Go app** (for mobile testing)
- Backend API running at `http://localhost:8080`

## 📦 Installation

```bash
npm install

```

## 🏃 Running the App

### Option 1: Development with Expo (Recommended for Development)

```bash
npx expo start

```

Then:

* Press `w` - Open in web browser
* Press `i` - Open in iOS simulator
* Press `a` - Open in Android emulator
* **Scan QR code** - Open in Expo Go app on your phone

### Option 2: Docker (Production Build)

```bash
docker compose up --build

```

Access the web app at: **http://localhost:3000**

### Option 3: Individual Platforms

```bash
npm run web      # Web browser
npm run ios      # iOS simulator
npm run android  # Android emulator

```

## 📱 Running with Expo Go

1. Make sure Docker backend is running on port **8080**
2. Start Expo dev server: `npx expo start`
3. **Connect your phone to the same WiFi** as your computer
4. Open **Expo Go** app and scan the QR code
5. The app automatically connects to your backend at `http://<your-ip>:8080`

## 🔧 API Configuration

The app dynamically configures the API URL based on the platform:

* **Web (Docker)**: Uses relative URLs via nginx proxy
* **Native (Expo Go)**: Auto-detects your computer's IP and connects to `:8080`
* **Custom URL**: Set `EXPO_PUBLIC_API_URL` environment variable

Configuration file: `src/utils/config.js`

## ✨ Features

### 🔐 Authentication

* User registration and login
* JWT token-based authentication
* Secure token storage

### 💱 Exchange Rates

* Real-time currency rates (USD, EUR, GBP, CHF)
* Offline mode with stale rate detection
* Pull-to-refresh functionality

### 💰 Trading

* Buy and sell foreign currencies
* Real-time balance updates
* Transaction confirmation dialogs
* Automatic balance refresh after trades

### 👛 Wallet Management

* View all currency balances
* PLN top-up functionality
* Real-time balance synchronization

### 📊 Transaction History

* Complete transaction log
* Buy/Sell/Top-up records
* Transaction details with timestamps
* Exchange rates for each transaction

## 📂 Project Structure

```
src/
├── components/          # Reusable React components
├── context/            
│   └── AuthContext.js  # Authentication state management
├── screens/            
│   ├── HomeScreen.js   # Exchange rates display
│   ├── TradeScreen.js  # Buy/Sell currency interface
│   ├── WalletScreen.js # Wallet & balance management
│   ├── HistoryScreen.js # Transaction history
│   ├── LoginScreen.js  # Login form
│   └── RegisterScreen.js # Registration form
├── services/           
│   ├── api.js          # Axios instance & interceptors
│   ├── authService.js  # Authentication API calls
│   ├── rateService.js  # Exchange rates API calls
│   ├── walletService.js # Wallet API calls
│   └── transactionService.js # Transaction API calls
└── utils/              
    ├── config.js       # API configuration
    └── currencyUtils.js # Currency formatting utilities

```

## 🐳 Docker Setup

### Dockerfile

* **Build Stage**: Node.js 18-alpine with Expo export
* **Production Stage**: Nginx alpine serving static files
* Optimized multi-stage build for small image size

### docker-compose.yml

```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    networks:
      - exchange-network

```

### nginx.conf

Configured to proxy API requests to backend and serve React app.

## 🔄 State Management

* **AuthContext**: Global authentication state
* **useFocusEffect**: Auto-refresh data on screen focus
* **Immediate UI updates**: Balance refreshes after successful trades

## 🌐 API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/rates` | GET | Get exchange rates |
| `/api/wallet` | GET | Get user wallets |
| `/api/wallet/topup` | POST | Top up PLN balance |
| `/api/transactions` | GET/POST | Get/Create transactions |

## 🛠️ Development Notes

### Key Updates

* Uses Expo SDK 50 and React Native 0.73
* Dockerized for easy web deployment
* Responsive design for both Mobile and Web

### State Management Fix

* Trades now immediately update UI balance (no refresh needed)
* `useFocusEffect` ensures fresh data on screen navigation

### Cross-Platform Compatibility

* Dynamic API URL configuration for web and mobile
* Platform-specific alert handling
* Responsive styling for web and mobile

## 🚨 Troubleshooting

**Port 8081 already in use**

```bash
# Expo will automatically use next available port (8082, etc.)

```

**Cannot connect from Expo Go**

* Ensure phone and computer are on same WiFi
* Check backend is accessible at `http://<your-ip>:8080`
* Verify firewall allows connections on port 8080

**Docker build fails**

```bash
# Clear Docker cache and rebuild
docker compose down
docker system prune -a
docker compose up --build

```

## 📝 License

This project is part of the Erto Labs currency exchange system.

## 🤝 Related Repositories

* Backend API: `../backend/`

```

```