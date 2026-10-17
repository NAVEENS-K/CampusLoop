# CampusLoop API (Spring Boot + MySQL)

This folder is the backend foundation for the Expo client. It is not yet a production-ready deployment.

## Requirements
- Java 21
- Maven 3.9+
- Docker Desktop (optional, for MySQL)

## Local database
From the repository root run `docker compose up -d mysql`. Copy `.env.example` to `.env` and configure secrets for your environment. Do not commit real secrets.

## Run API
From `backend/` run `mvn spring-boot:run`. The API listens on port 8080. Health check: `GET /api/health`.

## Current implementation scope
- Spring Boot REST API scaffold
- MySQL connection configuration
- Health endpoint
- Listing model and read endpoint
- CORS configuration for local Expo development

Before launch, implement and test authentication/session management, college-email verification, authorization, chat persistence and moderation, listing image storage, order state transitions, payment-provider webhooks/idempotency, refunds/disputes, audit logs, rate limits, and production secrets. Never store card details. Do not enable live payments until a provider account and marketplace settlement model are approved.