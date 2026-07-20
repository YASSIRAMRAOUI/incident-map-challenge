# 🗺️ Live Incident Map — Technical Challenge Solution (Web + Mobile)

A full-stack incident monitoring application built for operations teams in the control room and field workers in the field. Visualizes ~1,500 live incidents across Morocco in real time with interactive maps, reactive filtering, live streaming feeds, and proper state handling.

```
incident-map-challenge/
├── web/           # Angular 22 Web Dashboard (MapLibre GL JS + Signals)
├── mobile/        # React Native + Expo SDK 54 Mobile App (React Navigation + Context)
├── incidents.json # Shared dataset (~1,500 incident objects)
└── CHALLENGE-2.md # Original challenge specification
```

---

## 📋 Prerequisites

Before running the applications:
- **Node.js**: `v18.0.0` or higher & **npm**
- **Expo Go App**: Installed on your mobile device (Android / iOS) for testing Mobile
- **Google Maps API Key**: Required for Android mobile map tile rendering

---

## 🚀 Quick Start Instructions

### 1. Web Dashboard (Angular)
```bash
cd web
npm install
npm start
# Open http://localhost:4200/
```

### 2. Mobile App (React Native + Expo SDK 54)
```bash
cd mobile
npm install
npx expo start
```
- Open **Expo Go** on your phone (or Camera app on iOS) and scan the terminal QR code.
- If phone and PC are on separate networks: `npx expo start --tunnel`
- Clear cache if needed: `npx expo start -c`

---

## 🔑 Google Maps API Key Setup (Mobile Android)

Android map tile rendering in Expo Go requires a Google Maps API Key.

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** → Create a project.
2. Under **APIs & Services > Library**, search **Maps SDK for Android** and click **Enable**.
3. Go to **APIs & Services > Credentials** → Click **+ Create Credentials > API Key**.
4. Create `mobile/.env` and add your key:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```
*(iOS Apple Maps works automatically out of the box without requiring an API key).*

---

## 💡 How to Use the Applications

### Web Dashboard (`http://localhost:4200/`)
- **Map & Heatmap**: Interactive map centered on Morocco. Toggle between Marker/Cluster view and Heatmap density mode via the top header.
- **Filters**: Toggle Categories and Severities on the left panel to update the map in real time.
- **Live Feed**: New incidents stream every 3–8 seconds. Click the top notification badge to acknowledge.
- **Details**: Click any pin to open full incident details.

### Mobile App (Expo Go)
- **Map & List Tabs**: Switch between interactive Morocco map and paginated incident list (50 items/page).
- **Filter Modal**: Tap the floating **⚙️ Filter** button to filter by Category or Severity.
- **Details**: Tap any marker or list card to view complete incident metadata.

---

## ⚙️ Architecture & Technical Comparison

| Dimension | Web Dashboard (Angular) | Mobile App (React Native + Expo) |
|-----------|------------------------|-----------------------------------|
| **Framework** | Angular 22 (Standalone Components) | Expo SDK 54 / React Native 0.81 |
| **Map Engine** | MapLibre GL JS (WebGL, GPU clustering) | react-native-maps (Native MapView) |
| **State Pattern** | Angular Signals + RxJS streams | React Context + `useReducer` (MVI-like) |
| **Live Stream** | `interval()` simulation stream | `setTimeout()` simulation feed |
| **Performance** | WebGL source clustering | Dynamic `tracksViewChanges` freezing |
| **Documentation** | See [web/README.md](web/README.md) | See [mobile/README.md](mobile/README.md) |

---

## 🎯 Challenge Requirements Summary

### Web Version (7/7 Completed)
- [x] Interactive map (MapLibre GL JS, Morocco center, pan/zoom)
- [x] Severity markers with GPU-accelerated clustering
- [x] Toggleable density heatmap layer
- [x] Live update simulation without viewport reset
- [x] Category & severity multi-select reactive filtering
- [x] Explicit loading skeleton, empty, and error states
- [x] Performance optimization for 1,500+ markers

### Mobile Version (8/8 Completed)
- [x] Map screen with severity markers
- [x] List screen with newest-first order, pull-to-refresh & infinite scroll
- [x] Detail screen with full formatted metadata
- [x] Filter modal (category + severity multi-select)
- [x] Live updates without scroll or map position disruption
- [x] Loading skeletons, empty state with reset, error state with retry
- [x] Portrait and landscape support
- [x] Performance optimizations (`tracksViewChanges`, FlatList pagination, memoization)
