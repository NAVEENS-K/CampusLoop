# CampusLoop

CampusLoop is a campus second-hand marketplace built with Expo, React Native, TypeScript, Spring Boot, and MySQL.

## Run the mobile app
Requirements: Node.js LTS and npm.

```bash
npm install
npx expo install --check
npm run typecheck
npx expo start
```

For Android UI development, scan the QR code in Expo Go. **Razorpay checkout requires a native development/production build and does not run inside Expo Go.** Rebuild the app after installing the native SDK.

## Run the Spring Boot + MySQL API
Requirements: Java 21, Maven 3.9+, Docker Desktop.

```bash
docker compose up -d mysql
cd backend
mvn spring-boot:run
```

Health check: `http://localhost:8080/api/health`; active listings: `http://localhost:8080/api/listings`.

Set `EXPO_PUBLIC_API_URL` in a root `.env` file. Use `http://10.0.2.2:8080` for the Android emulator, `http://localhost:8080` for a browser on the same computer, or your computer's LAN IP for a physical phone. Restart Expo after changing the variable.

## Razorpay test checkout
The listing details screen now links to a polished checkout page. Checkout requires a listing loaded from the backend, a running Spring Boot/MySQL API, Razorpay test credentials configured only in the backend environment, and a custom native Android build containing `react-native-razorpay`.

Set backend environment variables `RAZORPAY_KEY_ID=rzp_test_...` and `RAZORPAY_KEY_SECRET=...`. Never put the secret in Expo variables or mobile code. The server creates provider orders using the listing's database price in paise and verifies checkout signatures. If online checkout is not configured or a listing is only local demo data, the UI will not claim a payment was made.

This is an integration foundation, **not production-ready real-money checkout**. Before accepting live payments, implement authenticated users and authorization, signed and idempotent provider webhooks, server-side payment-status/capture reconciliation, order state transitions, refunds/disputes, rate limits, audit logs, HTTPS, and an approved marketplace settlement model. Signature verification alone is not proof of final capture or settlement. Never store card details.

## Build an installable Android APK
```bash
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The EAS `preview` profile is configured to produce an APK. For GitHub Actions, add an Actions secret named `EXPO_TOKEN`, then open **Actions → Android APK (EAS) → Run workflow**. EAS provides the build URL.

For Google Play, use the production profile to create an Android App Bundle:
```bash
eas build --platform android --profile production
```
