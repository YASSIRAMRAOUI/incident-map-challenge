# 🗺️ Live Incident Map — Web + Mobile

## The Challenge

Our operations team monitors incidents happening across Morocco in real time. Some operators work from a **desktop dashboard** in a control room; others are in the field and only have their **phone**. Both need to plot incident data on an interactive map to see what is happening, where, and how serious it is — at a glance.

The task: build a **web dashboard (Angular)** and a **mobile app** that display a live, interactive map of Morocco with ~1,500 incidents plotted on it, plus the supporting screens an operator needs to make sense of that data.

### The Dataset

`incidents.json` contains ~1,500 incident objects across Morocco:

```json
{
  "id": "INC-00180",
  "title": "Injury requiring evacuation",
  "category": "Medical",
  "severity": "medium",
  "lat": 33.64044,
  "lng": -7.58983,
  "city": "Casablanca",
  "reportedAt": "2026-07-08T11:56:35Z"
}
```

- **Categories:** Accident, Fire, Medical, Security, Infrastructure, Flood, PowerOutage
- **Severities:** low, medium, high, critical
- **Locations:** 15+ cities across Morocco (Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, etc.)

---

## What Was Required

### Web Version (Angular)

| # | Requirement | Description |
|---|-------------|-------------|
| 1 | **Interactive map** | Full-screen, pan and zoom, centered on Morocco. No Google Maps — choose an open mapping library. |
| 2 | **Markers** | Plot each incident on the map. Visual should convey severity (colour or size). |
| 3 | **Heat / density view** | Second view mode showing incident density as a heatmap, toggleable from marker view. |
| 4 | **Live updates** | Simulate incidents arriving in real time. New incidents appear without full reload, preserving the user's pan/zoom. |
| 5 | **Filtering** | Filter by category and severity. Map updates reactively as filters change. |
| 6 | **States** | Handle loading, empty (no results), and error states explicitly. |
| 7 | **Performance** | Map stays responsive with ~1,500+ incidents. Clustering or another strategy encouraged. |

**Constraints:** Angular, TypeScript (properly typed), any mapping library except Google Maps.

### Mobile Version

| # | Requirement | Description |
|---|-------------|-------------|
| 1 | **Map screen** | Full-screen interactive map with severity markers and clustering for legibility at scale. |
| 2 | **List screen** | Incidents listed newest-first with pull-to-refresh and infinite scroll / lazy loading. |
| 3 | **Detail screen** | All fields for a single incident (title, category, severity, city, time, coordinates). |
| 4 | **Filters** | Bottom sheet or modal: category (multi-select), severity. Map and list update reactively. |
| 5 | **Live updates** | Simulate real-time arrivals. Don't disrupt user's map position or scroll offset. |
| 6 | **States** | Loading skeletons (not just spinners), empty state, error state. |
| 7 | **Orientation** | Works correctly in portrait and landscape. |
| 8 | **Performance** | Smooth scrolling and map interaction with full dataset. |

**Constraints:** Native (Kotlin + Compose or Swift + SwiftUI) or cross-platform. Production-level state management and architecture. Properly typed.

### What the README Should Cover

- Key technical decisions and why
- At least one tradeoff deliberately accepted
- What you'd do next with more time
- How you'd approach the other platform (if only one was built)

---

## What Was Built

Both platforms were built. Each one satisfies all of its functional requirements.

### Project Structure

```
incident-map-challenge/
├── web/                    # Angular 22 web dashboard
├── mobile/                 # React Native mobile app
├── incidents.json          # Shared dataset (~1,500 incidents)
├── CHALLENGE-2.md          # Original challenge specification
└── README.md               # This file
```

---

## Web Dashboard (Angular)

### Quick Start

```bash
cd web
npm install
npm start
# → http://localhost:4200/
```

### How Requirements Were Met

| Requirement | Implementation |
|-------------|----------------|
| Interactive map | **MapLibre GL JS** — open-source, WebGL-powered, CARTO Dark Matter basemap. Centered on Morocco, full pan/zoom. |
| Severity markers | Color-coded (green → amber → orange → red) and size-weighted markers. **GPU-accelerated clustering** via MapLibre's built-in source clustering. |
| Heatmap | Toggleable **heatmap layer** weighted by severity (critical = 1.0, low = 0.25). Green → amber → red colour ramp. |
| Live updates | `interval()`-based simulation emitting synthetic incidents every 3–8 seconds. Map updates without resetting viewport. "N new incidents" badge. |
| Filtering | **Category multi-select** + **severity multi-select** chip toggles. Map redraws reactively via Angular signals. |
| States | Loading skeleton with shimmer bars, "No incidents found" empty state with reset button, error state with retry. |
| Performance | MapLibre GPU clustering handles 1,500+ incidents smoothly. GeoJSON source updated in-place. |

### Key Technical Decisions

- **MapLibre GL JS** over Leaflet — WebGL rendering is faster for 1,500+ markers, native clustering/heatmap support, no API key needed.
- **Angular Signals** for filter/UI state, **RxJS** for async streams (live updates) — idiomatic Angular 22, fine-grained reactivity.
- **Dynamic `import('maplibre-gl')`** with `isPlatformBrowser` guard — MapLibre requires the DOM, this prevents SSR crashes.

### Tradeoffs Accepted

- **`any` types on MapLibre interop**: Dynamic import means some map API surfaces use `any` rather than strongly-typed generics. In production, a thin typed wrapper would solve this.
- **No unit tests**: Prioritized shipping all 7 functional requirements with a polished UI. Services (especially filtering logic) would be fully unit-tested in production.
- **Timer-based live updates**: The challenge says "simulate", so `interval()` suffices. A real system would use WebSocket/SSE with reconnection logic.

### What I'd Do Next

1. Date range filter (the data has timestamps)
2. Incident search (full-text across title, city, ID)
3. Supercluster in a Web Worker for 10k+ incidents
4. Offline support with Service Worker + IndexedDB
5. Unit + E2E tests (Vitest for services, Playwright for flows)

→ See [web/README.md](web/README.md) for full details.

---

## Mobile App (React Native + Expo SDK 54)

### Quick Start (Running with Expo Go)

```bash
cd mobile
npm install

# Start Expo dev server
npx expo start
```

1. Install **Expo Go** from the App Store or Google Play Store on your mobile phone.
2. Google Maps API key is configured in `mobile/app.json` under `android.config.googleMaps.apiKey` (required for Android map tile rendering; iOS Apple Maps works automatically).
3. Scan the terminal QR code using Expo Go (or iPhone camera).

> **Note:** The app is configured for **Expo SDK 54**. If phone and PC are on separate networks, launch with `npx expo start --tunnel`. To clear cache if needed, run `npx expo start -c`.

### How Requirements Were Met

| Requirement | Implementation |
|-------------|----------------|
| Map screen | **react-native-maps** MapView, severity-coded markers (colour + size), stats header with live badge. |
| List screen | **FlatList** sorted newest-first. Pull-to-refresh via `RefreshControl`. Infinite scroll with pagination (50 items/page). |
| Detail screen | All fields displayed in card layout: title, ID, category (with icon), severity (coloured badge), city, coordinates, timestamps (relative + absolute). |
| Filters | Slide-up **Modal** with category chips (icons) + severity chips (colour dots). Reset button. Active filter count on FAB. |
| Live updates | `setTimeout()`-based simulation (3–8s). "N new incidents" badge on both Map and List tabs. Doesn't reset scroll or map position. |
| States | **Loading skeleton** (card-shaped shimmer placeholders for list, centered spinner for map), empty state with reset, error state with retry. |
| Orientation | Flex-based layouts work in both portrait and landscape. |
| Performance | `React.memo()` on IncidentCard, FlatList `windowSize`/`removeClippedSubviews`, marker limit of 500. |

### Key Technical Decisions

- **React Native** over native Kotlin/Swift — the project was scaffolded with RN, and it delivers both platforms from one codebase. The code structure (Context + Reducer) maps directly to MVVM/MVI patterns.
- **React Context + `useReducer`** — unidirectional data flow. All state changes go through typed actions (`LOAD_SUCCESS`, `TOGGLE_CATEGORY`, `ADD_INCIDENT`, etc.). No external state library needed at this scale.
- **react-native-maps** — native rendering (Google Maps on Android, Apple Maps on iOS), well-maintained, supports custom markers.

### Tradeoffs Accepted

- **React Native vs. native Kotlin/Swift**: Challenge specifies native. RN was chosen because the project was scaffolded with it. README explains how the native approach would differ.
- **Marker limit of 500**: Rendering 1,500+ individual markers on a native MapView can cause jank. Production would use Supercluster or MapLibre Native.
- **Modal instead of gesture-driven bottom sheet**: Simpler than `@gorhom/bottom-sheet` while still meeting the "bottom sheet or modal" requirement.

### How I'd Approach Native (Kotlin/Compose or Swift/SwiftUI)

- **Android**: Jetpack Compose with `GoogleMap` composable from Maps Compose SDK. `ViewModel` + `StateFlow` (MVVM). `ModalBottomSheet` for filters. Kotlin data classes with sealed classes for enums.
- **iOS**: SwiftUI `Map` view from MapKit with annotation clustering. `ObservableObject` + `@Published` (MVVM). `NavigationStack` for navigation. Swift structs and enums.
- **Shared**: The TypeScript `Incident` interface maps directly to Kotlin `data class` or Swift `struct`. Filter logic (Set-based toggles) is identical.

### What I'd Do Next

1. Supercluster clustering for proper cluster circles with counts
2. Date range filter with a date picker
3. Offline support with AsyncStorage/MMKV caching
4. Persist last-used filters between app launches
5. Haptic feedback on filter toggles and marker taps
6. Jest unit tests for reducer, Detox E2E tests

→ See [mobile/README.md](mobile/README.md) for full details.

---

## Shared Architecture

Both apps share the same data model, filter logic, live update strategy, and design language:

| Concept | Web (Angular) | Mobile (React Native) |
|---------|---------------|----------------------|
| Data types | TypeScript interfaces | TypeScript interfaces (identical) |
| State management | Angular Signals + RxJS | React Context + useReducer |
| Architecture | Service-per-concern | Context + Reducer (MVI-like) |
| Filter pattern | Set-based category/severity toggles | Set-based category/severity toggles |
| Live updates | `interval()` → synthetic incidents | `setTimeout()` → synthetic incidents |
| Severity palette | `#10b981` / `#f59e0b` / `#f97316` / `#ef4444` | Same palette |
| Design theme | Dark (slate/navy), glassmorphism | Dark (slate/navy), card-based |
| Map library | MapLibre GL JS | react-native-maps |

---

## How We Evaluate (from the challenge)

> We look at the whole picture, roughly in this order:
>
> 1. Correctness and quality of the map integration and live-update behaviour
> 2. Reactive/state handling (filters, updates) and clean async code
> 3. Performance approach with a large number of incidents
> 4. Handling of loading / empty / error states
> 5. Code readability, structure, and typing/idioms
> 6. Clarity of the README and quality of reasoning
> 7. Attention to detail and to the product's context (a tool for operators making real-time decisions)
