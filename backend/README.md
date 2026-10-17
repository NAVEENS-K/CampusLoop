# CampusLoop API (Spring Boot + MySQL)

This is the backend foundation for the Expo client and is not production-ready.

## Requirements
- Java 21
- Maven 3.9+
- Docker Desktop (optional for local MySQL)

## Run locally
From the repository root:
```bash
docker compose up -d mysql
cd backend
mvn spring-boot:run
```
Health check: `GET /api/health`.

## Razorpay test checkout
Set these variables in the backend process environment (never commit live credentials):
- `RAZORPAY_KEY_ID=rzp_test_...`
- `RAZORPAY_KEY_SECRET=...`

The mobile client needs `EXPO_PUBLIC_API_URL` set to the API host reachable from the device. For Android Emulator use `http://10.0.2.2:8080`; for a physical phone use the computer's LAN IP.

Endpoints:
- `POST /api/payments/orders` with `{"listingId":123}`: creates a Razorpay order using the active listing's database price in paise.
- `POST /api/payments/verify` with `{"razorpayOrderId":"...","razorpayPaymentId":"...","razorpaySignature":"..."}`: verifies the checkout signature and stores a signature-verified status.

The client uses `react-native-razorpay`, a native SDK. **It does not run in Expo Go.** Use a custom Expo development build or EAS build after installing dependencies.

## Production blockers
This is an integration foundation only. Before accepting real money:
- Add authentication and access/ownership authorization for listings and orders.
- Verify provider payment state server-to-server and implement signed, idempotent Razorpay webhooks. A checkout signature alone does not prove capture or settlement.
- Add order state transitions, idempotency, refunds, disputes, reconciliation and audit logs.
- Approve the marketplace settlement model and comply with payment-provider requirements.
- Configure HTTPS, rate limits, monitoring, migrations and production secrets.
- Never store card details or expose the Razorpay secret in the Expo app.
