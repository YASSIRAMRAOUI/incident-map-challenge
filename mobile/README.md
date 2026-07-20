# 📱 Live Incident Map — Mobile App (React Native + Expo SDK 54)

A cross-platform mobile companion application built with React Native and Expo. Displays ~1,500 live incidents across Morocco with an interactive map, paginated list view, reactive filters, and real-time updates.

---

## 📋 Prerequisites

Before running the mobile app, ensure you have:
- **Node.js**: `v18.0.0` or higher (tested on Node v22) & **npm**
- **Expo Go App**: Installed on your mobile phone ([Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS App Store](https://apps.apple.com/app/expo-go/id982107779))
- **Network**: Mobile phone and computer connected to the **same Wi-Fi network**
- **Google Maps API Key**: Required for Android map tile rendering in Expo Go

---

## 🚀 Quick Start

```bash
cd mobile
npm install
npx expo start
```

1. Open **Expo Go** on your device.
2. Scan the terminal QR code in Expo Go (Android) or using your Camera app (iOS).

> **Troubleshooting Notes:**
> - Project is configured for **Expo SDK 54**.
> - If phone and PC are on separate networks, launch with tunnel mode: `npx expo start --tunnel`
> - If Metro cache needs clearing: `npx expo start -c`

---

## 🔑 Google Maps API Key Setup

Android map tiles require a Google Maps API Key to render in Expo Go.

### How to Get an API Key:
1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Create a project → Go to **APIs & Services > Library**.
3. Search for **Maps SDK for Android** and click **Enable**.
4. Go to **APIs & Services > Credentials** → Click **+ Create Credentials > API Key**.
5. Copy the generated key.

### Configuration (`.env` setup):
Create or edit `.env` in the `mobile/` directory:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```
*(On iOS, Apple Maps is used automatically out of the box without an API key).*

---

## 💡 How to Use the App

- **Map Tab**: Interactive map centered on Morocco. Displays severity-coded markers (Green = Low, Amber = Medium, Orange = High, Red = Critical). Tap any marker to view full details.
- **List Tab**: Paginated list of incidents sorted newest-first (50 items/page). Pull down to refresh. Tap any card to open the detail view.
- **Detail Screen**: Shows full incident metadata (title, category, severity, city, coordinates, relative time, formatted timestamp).
- **Filter Modal**: Tap the floating **⚙️ Filter** button to filter by Category or Severity. Map and List update reactively.
- **Live Feed**: New incidents stream every 3–8 seconds. A badge notifies you of new arrivals without interrupting your map pan or scroll position.

---

## ⚙️ Key Technical Decisions & Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Expo SDK 54 (React Native 0.81 / 0.86) | Cross-platform (Android + iOS) from a single codebase, fast testing via Expo Go. |
| **Map Engine** | `react-native-maps` | Native map rendering (Google Maps on Android, Apple Maps on iOS). |
| **Navigation** | React Navigation (Bottom Tabs + Stack) | Industry-standard navigation. Bottom tabs for Map/List, Native Stack for Detail. |
| **State Management** | React Context + `useReducer` | Unidirectional data flow (MVI-like). Typed actions (`LOAD_SUCCESS`, `TOGGLE_CATEGORY`, `ADD_INCIDENT`). |
| **60fps Performance** | Dynamic `tracksViewChanges` | Custom `<Marker>` views freeze after 800ms to eliminate layout re-calculations during map panning/zooming. |

---

## ⚖️ Tradeoffs Accepted

1. **Expo Go Compatibility over Custom Native Binaries**: Used dynamic `tracksViewChanges` marker optimization and a slide-up Modal instead of native binary libraries to run smoothly in standard Expo Go.
2. **Marker Throttling (300 visible)**: Rendering 1,500+ individual custom views simultaneously on native maps causes frame drops. Limited visible map pins to 300 to maintain 60fps pan/zoom.

---

## 🔮 How I'd Approach Native (Kotlin/Compose or Swift/SwiftUI)

- **Android (Kotlin + Compose)**: Jetpack Compose with `GoogleMap` composable from Maps Compose SDK. `ViewModel` + `StateFlow` (MVVM architecture). `ModalBottomSheet` for filters.
- **iOS (Swift + SwiftUI)**: SwiftUI `Map` view from MapKit with annotation clustering. `ObservableObject` + `@Published` (MVVM architecture). `NavigationStack` for navigation.
- **Shared Data Layer**: The TypeScript `Incident` interface maps directly to Kotlin `data class` or Swift `struct`.

---

## 🎯 Challenge Requirements Checklist

- [x] **Map screen** — Full-screen MapView, centered on Morocco, severity-coded markers
- [x] **List screen** — FlatList, newest-first, pull-to-refresh, infinite scroll (50/page)
- [x] **Detail screen** — All fields: title, category, severity, city, coordinates, timestamps
- [x] **Filters** — Modal with category & severity multi-select updating reactively
- [x] **Live updates** — New incidents every 3-8s preserving scroll & map position
- [x] **States** — Loading skeleton, empty state with reset, error state with retry
- [x] **Orientation** — Flex layouts work in both portrait and landscape
- [x] **Performance** — Dynamic marker freezing (`tracksViewChanges`), FlatList pagination, memoized cards
