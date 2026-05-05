# Travelbot — Mobile App

Cross-platform mobile client for **Travelbot**, an AI-assisted trip planner. Users sign in, describe a trip, and the app talks to the AI backend to suggest activities, choose locations, and generate a day-by-day program. They can chat with an assistant about their saved trips, identify landmarks from a photo, and manage their own profile.

Built with **React Native + Expo**, **Firebase** (Auth + Firestore), **gluestack-ui**, and **React Navigation**.

This repo is one of three that make up Travelbot:

| Repo | Role |
| --- | --- |
| [Agents_ai_travel_app](https://github.com/HabaAndrei/Agents_ai_travel_app) | Express API + AI agents |
| **[Travel_app](https://github.com/HabaAndrei/Travel_app)** *(this repo)* | React Native (Expo) mobile client |
| [travelbot-presentation](https://github.com/HabaAndrei/travelbot-presentation) | Next.js marketing / presentation site |

---

## Features

- **Email/password auth** with email verification (codes delivered via the backend)
- **Trip setup wizard** — pick destination, dates, hotel address, activity scale
- **Activity & location pickers** powered by AI suggestions from the backend
- **Auto-generated day-by-day programs** with maps + ticket info
- **Saved trips** stored per user in Firestore (`programs` collection)
- **In-app chat assistant** that has context on the user's saved trips
- **Find-a-place by photo** — upload an image, get the location back
- **Update gate** — the app checks Firestore for a minimum supported version and pushes users to update before continuing
- **Theming** via gluestack-ui + tailwind-rn (`twrnc`)

## Tech stack

- **Framework:** Expo SDK 52, React Native 0.76, React 18
- **Navigation:** `@react-navigation/native-stack`
- **UI:** `@gluestack-ui/themed`, `react-native-elements`, `twrnc`
- **State / persistence:** AsyncStorage, Firebase Auth persistence
- **Backend:** Firebase Firestore + the [Travelbot AI backend](../Agents_ai_travel_app)
- **Other:** `expo-image-picker`, `react-native-calendars`, `react-native-open-maps`, `fuse.js`

## Project layout

```
.
├── App.js                 # Stack navigator + auth bootstrap
├── Firebase.js            # FirebaseFirestore + FirebaseAuth wrappers
├── diverse.js             # Shared helpers (update check, etc.)
├── Screens/               # SetupTrip, Program, DailyProgram, Chat, …
├── Components/            # Reusable UI (Layout, NavbarProgram, modals, pickers)
├── CustomElements/        # Lower-level themed primitives
├── providers/             # EnvConfig + signed-request helper
├── assets/, img/          # Icons, splash, illustrations
├── app.json               # Expo config (slug, bundle IDs, EAS project)
└── babel.config.js
```

## Getting started (local)

### 1. Prerequisites

- Node.js **18+** and npm
- The **Expo CLI** (no global install needed — `npx expo …` works)
- iOS Simulator (Xcode, macOS) and/or Android Emulator (Android Studio), or the **Expo Go** app on a physical device
- A running instance of the [Travelbot backend](https://github.com/HabaAndrei/Agents_ai_travel_app) reachable from your device
- A **Firebase** project with Email/Password auth + Firestore enabled

### 2. Clone & install

```bash
git clone https://github.com/HabaAndrei/Travel_app.git
cd Travel_app
npm install
```

### 3. Configure environment

Copy the example file and fill it in:

```bash
cp .env.example .env
```

> All variables are prefixed `EXPO_PUBLIC_` so they get bundled into the client. Only put values here that are safe to ship to a device.

| Variable | Description |
| --- | --- |
| `EXPO_PUBLIC_AUTHORIZATION_CUSTOM_TOKEN` | Shared secret — **must match** `AUTHORIZATION_CUSTOM_TOKEN` on the backend |
| `EXPO_PUBLIC_ADDRESS_FUNCTION_AI_GENERATION` | URL of `POST /ai-generation` |
| `EXPO_PUBLIC_ADDRESS_FUNCTION_FUZZY` | URL of `GET /search-destination` |
| `EXPO_PUBLIC_ADDRESS_FUNCTION_SEND_CODE_VERIFICATION` | URL of `POST /send-code-email-verification` |
| `EXPO_PUBLIC_SERVER_ADDRESS_FIND_LOCATION` | URL of `POST /find-image-location` |
| `EXPO_PUBLIC_SERVER_ADDRESS_IMAGES` | Base URL for static images served by the backend |
| `EXPO_PUBLIC_API_KEY` | Firebase web API key |
| `EXPO_PUBLIC_AUTH_DOMAIN` | Firebase auth domain |
| `EXPO_PUBLIC_PROJECT_ID` | Firebase project ID |
| `EXPO_PUBLIC_STORAGE_BUCKET` | Firebase storage bucket |
| `EXPO_PUBLIC_MESSAGING_SENDER_ID` | Firebase sender ID |
| `EXPO_PUBLIC_APP_ID` | Firebase app ID |
| `EXPO_PUBLIC_MEASUREMENT_ID` | Firebase measurement ID (optional) |

### 4. Required Firestore collections

The app reads/writes the following collections — create them (empty is fine) before first run:

| Collection | Purpose |
| --- | --- |
| `users` | One doc per user, keyed by `uid` |
| `programs` | Saved trips |
| `conversations` / `messages` | Chat history |
| `code_verification` | Stores codes emailed during signup |
| `errors` | Crash/error log |
| `app_versions` | Single doc `app_versions` controlling the update gate. Add a field per platform with the minimum supported version. |
| `details_places` | Cache shared with the backend |

### 5. Run

```bash
# Metro bundler + dev menu
npm run start

# Build & run a dev client
npm run ios       # iOS simulator (macOS only)
npm run android   # Android emulator / device
npm run web       # Web target
```

Once Metro is running you can:
- press `i` / `a` to open iOS / Android,
- or scan the QR code with **Expo Go** on a physical device (the device must be able to reach your backend — use a LAN IP, not `localhost`).

### 6. Tests

```bash
npm test
```

The Jest config (in `package.json`) uses the `jest-expo` preset and ignores the usual native-module suspects.

## Building for the stores

The project is wired up to **EAS** — see `app.json` for the bundle IDs (`com.haba03.expo-app` / `com.haba03.expoapp`) and `extra.eas.projectId`. To build:

```bash
npm install -g eas-cli   # or: npx eas-cli@latest
eas login
eas build --platform ios       # or android, or all
```

You'll need to either fork the EAS project or replace `extra.eas.projectId` with your own.

## Troubleshooting

- **Auth works but every API call returns 401** — the `EXPO_PUBLIC_AUTHORIZATION_CUSTOM_TOKEN` does not match the backend value.
- **`Network request failed`** on a physical device — the device cannot reach `localhost`. Use your machine's LAN IP (e.g. `http://192.168.1.10:5050/...`) in `.env`.
- **Firebase initialization errors** — double-check that all `EXPO_PUBLIC_*` Firebase variables are present; missing values are silently `undefined`.
- **App is stuck on the Update screen** — your local Expo build version is below the minimum stored in Firestore's `app_versions` doc.

## License

No license has been declared yet. Until one is added, treat the code as **all rights reserved** — open an issue if you want to use it.
