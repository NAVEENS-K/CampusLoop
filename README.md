# CampusLoop

CampusLoop is a campus-only second-hand marketplace prototype built with Expo, React Native, TypeScript, Spring Boot, and MySQL.

## Run the mobile app
Requirements: Node.js LTS and npm.

```bash
npm install
npx expo install --check
npm run typecheck
npx expo start
```

For a web preview run `npx expo start --clear` and press `w`. On Android, scan the QR code in Expo Go or press `a` with an emulator configured.

The app currently supports a polished Explore/Search UI, category filters, saved items, locally persisted listing creation, listing details, local demo chat, and profile summaries. Local listing and wishlist state is stored with AsyncStorage. Demo chats and purchase requests are not yet shared between users.

## Run the Spring Boot + MySQL API
Requirements: Java 21, Maven 3.9+, Docker Desktop.

```bash
docker compose up -d mysql
cd backend
mvn spring-boot:run
```

Health check: `http://localhost:8080/api/health`; active listings: `http://localhost:8080/api/listings`.

To connect the Expo client, create a root `.env` file with `EXPO_PUBLIC_API_URL` set to the API host reachable from your device. Use `http://10.0.2.2:8080` for the Android emulator, `http://localhost:8080` for a browser on the same computer, or your computer's LAN IP for a physical phone. Restart Expo after changing the variable. Keep production credentials out of the client.

The API is currently a backend foundation: health and listing reads, JPA/MySQL setup, and local development CORS. Authentication, college email verification, authorized listing writes, persistent chat, moderation, orders, and payment-provider integration remain to be implemented and security-tested before production.

## Build an installable Android APK
```bash
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The EAS `preview` profile is configured to produce an APK. Sign in to your own Expo account and follow the build URL that EAS returns. This repository cannot produce a signed APK until an EAS account/build has been authorized.

For Google Play, use the production profile to create an Android App Bundle:
```bash
eas build --platform android --profile production
```

## Before launch
- Implement secure sign-in and verification for the approved college email domain.
- Add role/ownership authorization, input validation, rate limiting, and audit logging.
- Store listing images in object storage, not in the database.
- Persist chat with access controls and reporting/blocking.
- Implement orders and a payment provider's server-side order creation, signature verification, idempotent webhooks, refunds, and dispute handling. Keep provider secrets only on the server; never store card data.
- Decide and verify the marketplace settlement model before enabling real payments.
- Use migrations instead of automatic schema updates in production, and configure TLS, backups, monitoring, and secrets.
