# CampusLoop API (Spring Boot + MySQL)

This folder contains the backend scaffold for the Expo assignment prototype. It is not production-ready.

## Requirements
- Java 21
- Maven 3.9+
- Docker Desktop (optional, for local MySQL)

## Run locally
From the repository root:
```bash
docker compose up -d mysql
cd backend
mvn spring-boot:run
```

Health check: `GET /api/health`; active listings: `GET /api/listings`.

## Current assignment scope
- Spring Boot REST API scaffold
- MySQL/JPA connection and listing read endpoint
- Local development CORS
- Mobile checkout UI is a visual prototype only; no payment provider is connected and no money is charged.

Before using this project for real transactions, implement authentication and authorization, order state transitions, provider order creation, signed and idempotent webhooks, payment reconciliation, refunds/disputes, audit logs, rate limiting, HTTPS, production secrets, and an approved marketplace settlement model. Never store card details.
