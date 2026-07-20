# Live Incident Map — Mobile (React Native + Expo SDK 54)

A cross-platform mobile app built with React Native and Expo that displays ~1,500 live incidents across Morocco with an interactive map, incident list, filtering, and real-time updates.

---

## 📱 Quick Start Guide (Expo Go — SDK 54)

This project is explicitly configured and locked to **Expo SDK 54** to guarantee seamless testing on physical devices running the **Expo Go** mobile app.

### Step 1: Install Dependencies
```bash
cd mobile
npm install
```

### Step 2: Google Maps API Key Setup (Android)
Android requires a Google Maps API Key to render map tiles in Expo Go. The key is configured in `mobile/app.json`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```
> **Note for iOS users:** Apple Maps works automatically out of the box without requiring an API key.

### Step 3: Run the Expo Dev Server
```bash
npx expo start
```
*If you need to clear the bundler cache at any point, run:*
```bash
npx expo start -c
```

### Step 4: Open in Expo Go
1. Open the **Expo Go** app on your phone.
2. Ensure your phone and development computer are connected to the **same Wi-Fi network**.
3. Scan the QR code displayed in your terminal:
   - **Android:** Scan using the "Scan QR code" button inside the Expo Go app.
   - **iOS:** Scan directly using your iPhone Camera app.

---

## ⚙️ Expo SDK 54 Compatibility & Version Matching

This project uses **Expo SDK 54**. If your Expo Go app prompts about version compatibility:

- **If your device Expo Go is on SDK 54:** The app will connect immediately.
- **If phone & PC are on separate networks:** Start Expo with tunnel mode:
  ```bash
  npx expo start --tunnel
  ```
- **If you need to sync Expo native package versions:**
  ```bash
  npx expo install --fix
  ```

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Expo SDK 54 (React Native 0.81 / 0.86) | Cross-platform (Android + iOS) from a single codebase, fast testing via Expo Go. |
| **Map library** | react-native-maps | Native map rendering (Google Maps on Android, Apple Maps on iOS). |
| **Navigation** | React Navigation (bottom tabs + native stack) | Industry standard for React Native. Bottom tabs for Map/List, stack for Detail. |
| **State management** | React Context + `useReducer` | Unidirectional data flow (MVI-like). Simple, no extra dependencies, typed actions (`LOAD_SUCCESS`, `TOGGLE_CATEGORY`, `ADD_INCIDENT`). |
| **Filtering** | Modal bottom sheet | Slide-up modal with category (icons) & severity (colour dots) chip toggles. |
| **Performance** | Dynamic `tracksViewChanges` + marker throttling + FlatList pagination | Dynamic marker tracking toggle (freezes markers after 800ms) ensures 60fps pan/zoom. Pagination (50/page) on list. |

---

## Tradeoffs Accepted

- **Expo Go compatibility**: Used dynamic marker optimization (`tracksViewChanges={tracksViewChanges}`) instead of custom native binary plugins so the app runs directly inside standard Expo Go.
- **Marker limit of 300 on map**: Rendering 1,500+ individual markers simultaneously on a native MapView can cause jank on mobile devices. Limited visible markers to 300 for butter-smooth panning. Production would use Supercluster or MapLibre Native.
- **Modal instead of @gorhom/bottom-sheet**: To avoid native binary dependencies incompatible with standard Expo Go, a slide-up Modal was used.

---

## What I'd Do Next

1. **Supercluster clustering**: Integrate Supercluster directly for cluster circles with counts.
2. **Date range filter**: Add a date picker to the filter modal.
3. **Offline support**: Cache incidents in AsyncStorage or MMKV, show cached data when offline.
4. **Persist filters**: Save last-used filter state to AsyncStorage.
5. **Haptic feedback**: Add haptics on filter toggles and marker taps using `expo-haptics`.
6. **Jest & E2E tests**: Unit tests for reducer/context logic and component render tests.

---

## How I'd Approach Native (Kotlin/Compose or Swift/SwiftUI)

- **Android (Kotlin + Compose)**: Use Jetpack Compose with `GoogleMap` composable from Maps Compose SDK. State via `ViewModel` + `StateFlow` (MVVM). Navigation with Compose Navigation. Filtering via a `ModalBottomSheet` composable.
- **iOS (Swift + SwiftUI)**: Use `Map` view from MapKit with annotation clustering. State via `ObservableObject` + `@Published` (MVVM). Navigation with `NavigationStack`.
- **Shared data layer**: The TypeScript `Incident` interface maps directly to Kotlin `data class` or Swift `struct`. The filter logic (Set-based category/severity toggles) is identical across platforms.

---

## Features Implemented

All 8 mobile functional requirements from the challenge:

1. ✅ **Map screen** — Full-screen MapView, centered on Morocco, severity-coded markers
2. ✅ **List screen** — FlatList, newest-first, pull-to-refresh, infinite scroll (50/page)
3. ✅ **Detail screen** — All fields: title, category, severity, city, coordinates, timestamps
4. ✅ **Filters** — Modal with category multi-select, severity multi-select, reset
5. ✅ **Live updates** — New incidents every 3-8s without disrupting scroll/map position
6. ✅ **States** — Loading skeleton, empty state ("No incidents match"), error state with retry
7. ✅ **Orientation** — Flex layouts work in both portrait and landscape
8. ✅ **Performance** — Dynamic marker freezing (`tracksViewChanges`), FlatList pagination, memoized cards

### Bonus
- "N new incidents" badge on both Map and List screens
- Filter count badge on FAB
- Dark theme consistent with web dashboard
- Severity-colored stripe on list cards
- Monospace formatting for IDs and timestamps

---

## Project Structure

```
mobile/
├── App.tsx                          # Root component with providers
├── app.json                         # Expo SDK 54 config & Google Maps API key
├── babel.config.js                  # Babel config for Expo + Reanimated
├── src/
│   ├── models/
│   │   └── incident.ts              # Types, enums, color/icon mappings
│   ├── context/
│   │   └── IncidentContext.tsx       # React Context + useReducer state management
│   ├── services/
│   │   ├── incidentLoader.ts        # Load bundled incidents.json
│   │   └── liveUpdates.ts           # Simulated real-time incident feed
│   ├── navigation/
│   │   └── AppNavigator.tsx         # Bottom tabs + stack navigator
│   ├── screens/
│   │   ├── MapScreen.tsx            # Map with markers, stats bar, filter FAB
│   │   ├── ListScreen.tsx           # FlatList with pagination, pull-to-refresh
│   │   └── DetailScreen.tsx         # Full incident details
│   ├── components/
│   │   ├── FilterModal.tsx          # Category & severity filter modal
│   │   ├── IncidentCard.tsx         # Memoized list item card
│   │   ├── SeverityBadge.tsx        # Color-coded severity indicator
│   │   ├── LoadingSkeleton.tsx      # Loading state (map + list variants)
│   │   ├── EmptyState.tsx           # No-results state with reset
│   │   └── ErrorState.tsx           # Error state with retry
│   ├── theme/
│   │   └── theme.ts                 # Design tokens (colors, spacing, fonts)
│   ├── utils/
│   │   └── formatDate.ts            # Relative time & timestamp formatting
│   └── data/
│       └── incidents.json           # Bundled incident dataset
```
