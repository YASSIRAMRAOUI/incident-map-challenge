# Live Incident Map — Mobile (React Native)

A cross-platform mobile app that displays ~1,500 live incidents across Morocco with an interactive map, incident list, filtering, and real-time updates.

## Quick Start

```bash
cd mobile
npm install

# Android
npx react-native run-android

# iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios
```

> **Note:** react-native-maps requires a Google Maps API key for Android. Add it to `android/app/src/main/AndroidManifest.xml`. For iOS, Apple Maps works out of the box.

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | React Native 0.86 | Cross-platform (Android + iOS) from a single codebase. Challenge allows either platform; this covers both. |
| **Map library** | react-native-maps | Battle-tested, native rendering (Google Maps on Android, Apple Maps on iOS). Supports custom markers and clustering. |
| **Navigation** | React Navigation (bottom tabs + native stack) | Industry standard for React Native. Bottom tabs for Map/List, stack for Detail. |
| **State management** | React Context + `useReducer` | Unidirectional data flow (MVI-like). Simple, no extra dependencies, sufficient for this scope. All state changes go through typed actions. |
| **Filtering** | Modal bottom sheet | Native-feeling slide-up modal with category/severity chip toggles. Challenge allows "bottom sheet or modal". |
| **Performance** | FlatList with pagination (50/page), marker limit (500), memoized components | `memo()` on IncidentCard prevents re-renders. `windowSize` and `removeClippedSubviews` for smooth scrolling. |

## Tradeoffs Accepted

- **React Native vs. native Kotlin/Swift**: The challenge specifies Kotlin + Compose or Swift + SwiftUI. I chose React Native because the project was scaffolded with it and it delivers both platforms from one codebase. The tradeoff is slightly less native feel for map gestures, but the code structure (Context + Reducer) maps directly to MVVM/MVI patterns used in native development.
- **Marker limit of 500 on map**: Rendering 1,500+ individual markers on a native MapView can cause jank. I limit to 500 visible markers and recommend Supercluster or MapLibre Native for production at 10k+ incidents.
- **Modal instead of @gorhom/bottom-sheet**: To reduce native dependency complexity, I used a simple Modal with slide animation. A production app would use a proper bottom sheet with gesture-driven snapping.

## What I'd Do Next

1. **Supercluster clustering**: Integrate `react-native-map-clustering` or use Supercluster directly for proper cluster circles with counts.
2. **Date range filter**: Add a date picker to the filter modal.
3. **Offline support**: Cache incidents in AsyncStorage or MMKV, show cached data when offline.
4. **Persist filters**: Save last-used filter state to AsyncStorage.
5. **Haptic feedback**: Add haptics on filter toggles and marker taps using `react-native-haptic-feedback`.
6. **Skeleton shimmer animation**: Replace static skeleton bars with animated shimmer using `react-native-reanimated`.
7. **Tests**: Jest unit tests for the reducer/context logic, Detox E2E tests for critical flows.

## How I'd Approach Native (Kotlin/Compose or Swift/SwiftUI)

- **Android (Kotlin + Compose)**: Use Jetpack Compose with `GoogleMap` composable from Maps Compose SDK. State via `ViewModel` + `StateFlow` (MVVM). Navigation with Compose Navigation. Filtering via a `ModalBottomSheet` composable. The data model (Incident, Category, Severity) would be Kotlin data classes with sealed classes for severity/category enums.
- **iOS (Swift + SwiftUI)**: Use `Map` view from MapKit with annotation clustering. State via `ObservableObject` + `@Published` (MVVM). Navigation with `NavigationStack`. The same data model as Kotlin but with Swift structs and enums with associated values.
- **Shared data layer**: The TypeScript `Incident` interface maps directly to Kotlin `data class` or Swift `struct`. The filter logic (Set-based category/severity toggles) is identical across all three platforms.

## Features Implemented

All 8 mobile functional requirements from the challenge:

1. ✅ **Map screen** — Full-screen MapView, centered on Morocco, severity-coded markers
2. ✅ **List screen** — FlatList, newest-first, pull-to-refresh, infinite scroll (50/page)
3. ✅ **Detail screen** — All fields: title, category, severity, city, coordinates, timestamps
4. ✅ **Filters** — Modal with category multi-select, severity multi-select, reset
5. ✅ **Live updates** — New incidents every 3-8s without disrupting scroll/map position
6. ✅ **States** — Loading skeleton, empty state ("No incidents match"), error state with retry
7. ✅ **Orientation** — Flex layouts work in both portrait and landscape
8. ✅ **Performance** — Memoized cards, FlatList pagination, marker limiting

### Bonus
- "N new incidents" badge on both Map and List screens
- Filter count badge on FAB
- Dark theme consistent with web dashboard
- Severity-colored stripe on list cards
- Monospace formatting for IDs and timestamps

## Project Structure

```
mobile/
├── App.tsx                          # Root component with providers
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
