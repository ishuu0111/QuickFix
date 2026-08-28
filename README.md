# ConsumerInterface

A premium, production-styled home-services booking app built with **React Native (Expo SDK 54)**. Inspired by modern service-marketplace apps — completely original UI, components, and code.

## ✨ Features

- Splash → Login/Register → Home flow with animated transitions
- Home feed: banners, categories, popular/top-rated services, featured professionals
- Category browser with search, category chips, and sorting
- Service details with gallery, time-slot picker, photo upload, address selector
- Full booking flow: **Finding Professional → Professional Assigned → Live Tracking (map) → Payment → Rating & Review**
- Booking history with Upcoming / Completed / Cancelled tabs + Rebook
- Wallet with balance card and transaction history
- Grouped notifications
- Profile with editable details, saved addresses, and settings (dark mode, notification preferences, language, security)
- Reusable design-system components (Button, Input, Card, Badge, Avatar, RatingStars, BottomSheet, Modal, Skeleton, EmptyState, OTPInput, MapCard, and more)
- Dark mode support via Context API
- Smooth animations powered by `react-native-reanimated`

## 🧱 Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Language | JavaScript |
| Navigation | React Navigation v7 (native-stack + bottom-tabs) |
| Maps | react-native-maps |
| Icons | @expo/vector-icons (Ionicons) |
| Animation | react-native-reanimated, react-native-gesture-handler |
| State | React Context API |

## 📁 Project Structure

```
ConsumerInterface/
├── assets/
│   ├── images/
│   ├── icons/
│   ├── illustrations/
│   └── animations/
├── src/
│   ├── components/     # Reusable UI building blocks
│   ├── navigation/      # Root stack + bottom tab navigators
│   ├── screens/         # All 15+ app screens
│   ├── hooks/            # useAsyncAction, useDebouncedValue
│   ├── context/          # AppContext (auth, theme, bookings)
│   ├── theme/             # Design tokens (colors, spacing, typography)
│   ├── constants/         # App-wide constants
│   ├── services/          # Mock API layer (dummy data, simulated latency)
│   ├── utils/              # Formatting & validation helpers
│   └── data/                # Dummy/mock data
├── App.js
├── app.json
├── babel.config.js
└── package.json
```

## 🎨 Design System

- **Primary:** `#0D6EFD` · **Secondary:** `#2563EB` · **Accent:** `#22C55E`
- **Background:** `#F8FAFC` · **Card:** `#FFFFFF` · **Text:** `#111827` · **Subtitle:** `#6B7280`
- **Radius:** 22px cards, pill buttons · **Spacing:** 8pt grid
- Gradients, soft shadows, and glass-style cards throughout
- Illustrations are built entirely from vector icons + gradients + Reanimated motion — no binary image/Lottie assets are required for the app to run.

## 🚀 Getting Started

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with the Expo Go app.

> **Note on Maps:** `react-native-maps` requires a Google Maps API key for Android and (optionally) iOS. Add your key to `app.json` under `ios.config.googleMapsApiKey` and `android.config.googleMaps.apiKey`. On web, `MapCard` gracefully falls back to a styled placeholder since `react-native-maps` doesn't support web.

## 🔑 Demo Login

Any email/password combination will log you in — this project uses local dummy data and a mock service layer (`src/services/api.js`), so there's no real backend to connect to. You can also tap **Continue as Guest** from the splash screen.

## 📄 License

This project is provided as a UI/UX reference implementation and is free to use as a starting point for your own app.
