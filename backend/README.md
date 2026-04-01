# Currency Exchange API (Backend)

A Spring Boot REST API that powers the Currency Exchange System. It handles user authentication, real-time exchange rate synchronization with NBP (National Bank of Poland), and transaction processing.

## 🚀 Features

- **Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- **Real-Time Data:** Automatically fetches and updates exchange rates (USD, EUR, GBP, CHF) every 15 minutes.
- **Wallet System:** Manages user balances in multiple currencies (PLN, USD, EUR, GBP, CHF).
- **Trading Engine:** Processes buy/sell transactions with real-time calculations.
- **History:** Maintains a full log of all user transactions.

## 🛠 Tech Stack

- **Language:** Java 17
- **Framework:** Spring Boot 3.2
- **Database:** PostgreSQL 15
- **Security:** Spring Security & JWT
- **Containerization:** Docker & Docker Compose

## 🐳 Quick Start (Docker)

The application and the database are fully containerized.

### 1. Start the Application
Run the following command in the `backend` directory:

```bash
docker compose up -d --build

This will start:

PostgreSQL Database on port 5432

Spring Boot API on port 8080

2. Stop the Application
Bash
docker compose down
To stop and also remove the database volume (reset data):

Bash
docker compose down -v
Method,Endpoint,Description,Auth Required
POST,/api/auth/register,Register new user,❌
POST,/api/auth/login,Login and get JWT,❌
GET,/api/rates,Get current exchange rates,❌
GET,/api/wallet,Get wallet balances,✅
POST,/api/wallet/topup,Add PLN funds to wallet,✅
POST,/api/transactions,Buy/Sell currency,✅
GET,/api/transactions,Get transaction history,✅

⚙️ Configuration
The application is configured via application.yml and environment variables in docker-compose.yml.

Database URL: jdbc:postgresql://postgres:5432/exchange_db

NBP API URL: https://api.nbp.pl/api/exchangerates/tables/A/?format=json

Supported Currencies: USD, EUR, GBP, CHF

📂 Project Structure
src/main/java/com/ertolabs/exchange/
├── config/       # Security & JWT configuration
├── controller/   # REST API Controllers
├── dto/          # Data Transfer Objects
├── entity/       # Database Entities (User, Wallet, Transaction)
├── repository/   # JPA Repositories
├── scheduler/    # Scheduled tasks (Rate Sync)
└── service/      # Business Logic

## 💾 Database Schema

The application uses a relational PostgreSQL database with the following structure:

| Table | Description | Key Columns |
| :--- | :--- | :--- |
| **users** | Stores user credentials | `id`, `email`, `password`, `created_at` |
| **wallets** | User account balances | `id`, `user_id`, `currency`, `balance` |
| **transactions** | History of trades | `id`, `user_id`, `type`, `from_currency`, `to_currency`, `amount` |
| **exchange_rates** | Cached NBP rates | `id`, `currency`, `rate`, `fetched_at` |