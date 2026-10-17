# CampusLoop

CampusLoop is a campus second-hand marketplace assignment prototype built with Expo, React Native, TypeScript, Spring Boot, and MySQL.

## Run the mobile UI
Requirements: Node.js LTS and npm.

```bash
npm install
npx expo install --check
npm run typecheck
npx expo start
```

For a web preview, run `npx expo start --clear` and press `w`. On Android, scan the QR code in Expo Go or press `a` with an emulator configured.

The app includes Explore/Search, categories, saved items, local listing creation, listing details, local demo chat, profile summaries, and a polished checkout UI. Checkout supports selecting a visual payment option and displays a demo confirmation. **No payment provider is connected and no real payment is processed.** The UI can be presented for an assignment without payment credentials, a backend payment service, or a custom native build.

## Backend scaffold
Requirements: Java 21, Maven 3.9+, Docker Desktop.

```bash
docker compose up -d mysql
cd backend
mvn spring-boot:run
```

Health check: `http://localhost:8080/api/health`; active listings: `http://localhost:8080/api/listings`.

To connect listing data, create a root `.env` file with `EXPO_PUBLIC_API_URL` set to the API host reachable from your device. Use `http://10.0.2.2:8080` for the Android emulator, `http://localhost:8080` for a browser on the same computer, or your computer's LAN IP for a physical phone.

## Android APK
```bash
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
``

The EAS `preview` profile is configured to produce an APK. For GitHub Actions, add an Actions secret named `EXPO_TOKEN`, then open **Actions → Android APK (EAS) → Run workflow**.

## Scope note
This is an assignment/demo prototype. Listings, chat, and requests are not a complete multi-user marketplace. The checkout screen is UI-only and must not be represented as accepting real money.
