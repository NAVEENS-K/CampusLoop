# CampusLoop UI starter

Expo + React Native + TypeScript prototype. This is frontend-only: listings, messages and purchase requests are demo data; no real login, backend, shared data or payments.

## Requirements
Install Node.js LTS and npm. Install Expo Go on an Android phone for a quick preview.

## Run
```bash
npm install
npx expo install --check
npm run typecheck
npx expo start
```
Scan the QR code with Expo Go. If devices cannot connect:
```bash
npx expo start --tunnel
```

## Build an installable APK
```bash
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```
Open the build URL returned by EAS and download the APK to install it on Android.

For Google Play, create a production AAB:
```bash
eas build --platform android --profile production
```

## Current scope
Home, search/filter, sell form, listing details, inbox, local demo chat, purchase request simulation and profile. Real payments must not be enabled until a marketplace payment provider and operational model are approved.
