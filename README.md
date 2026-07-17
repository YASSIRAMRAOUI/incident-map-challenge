# 🗺️ Live Incident Map Challenge

A full-stack incident monitoring platform built for the coding challenge. Two applications — a **web dashboard** (Angular) and a **mobile app** (React Native) — both visualizing ~1,500 live incidents across Morocco with interactive maps, real-time updates, filtering, and proper state handling.

---

## Project Structure

```
incident-map-challenge/
├── web/                    # Angular 22 web dashboard
├── mobile/                 # React Native mobile app
├── incidents.json          # Shared dataset (~1,500 incidents)
└── CHALLENGE-2.md          # Original challenge specification
```

---

## Web Dashboard (Angular)

A full-screen map dashboard with clustering, heatmap toggle, reactive filters, and a live incident feed.

### Quick Start

```bash
cd web
npm install
npm start
# → http://localhost:4200/
```

### Features

| Requirement | Implementation |
|-------------|----------------|
| Interactive map | MapLibre GL JS, pan/zoom, centered on Morocco |
| Severity markers | Color-coded (green→red), size-weighted, GPU-clustered |
| Heatmap | Toggleable layer weighted by severity |
| Live updates | Synthetic incidents every 3-8s, "N new" badge |
| Filtering | Category + severity chip toggles, reactive map updates |
| States | Loading skeleton, empty state, error state with retry |
| Performance | MapLibre GPU clustering handles 1,500+ smoothly |

### Tech Stack

- **Angular 22** with standalone components and signals
- **MapLibre GL JS** (open-source, WebGL, no API key)
- **RxJS** for async streams + **Angular Signals** for UI state
- **CARTO Dark Matter** basemap

→ See [web/README.md](web/README.md) for detailed technical decisions and tradeoffs.

---

## Mobile App (React Native)

A cross-platform mobile app with map, list, and detail screens — bottom tab navigation, filter modal, and live updates.

### Quick Start

```bash
cd mobile
npm install

# Android
npx react-native run-android

# iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios
```

> **Note:** Android requires a Google Maps API key in `AndroidManifest.xml`. iOS uses Apple Maps out of the box.

### Features

| Requirement | Implementation |
|-------------|----------------|
| Map screen | react-native-maps, severity-coded markers, stats header |
| List screen | FlatList, newest-first, pull-to-refresh, infinite scroll (50/page) |
| Detail screen | All fields: title, category, severity, city, coordinates, timestamps |
| Filters | Slide-up modal with category + severity chip toggles |
| Live updates | Timer-based (3-8s), badge on both screens |
| States | Loading skeleton, empty state, error state with retry |
| Orientation | Flex layouts — portrait and landscape |
| Performance | Memoized cards, FlatList pagination, marker limiting |

### Tech Stack

- **React Native 0.86** with TypeScript
- **react-native-maps** (native MapView rendering)
- **React Navigation** (bottom tabs + native stack)
- **React Context + useReducer** (unidirectional data flow)

→ See [mobile/README.md](mobile/README.md) for detailed technical decisions and tradeoffs.

---

## Shared Architecture

Both apps follow the same data model and patterns:

```
┌─────────────────────────────────────────────┐
│                incidents.json                │
│         ~1,500 incidents across Morocco      │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
┌──────────────┐       ┌──────────────┐
│  Web (Angular)│       │ Mobile (RN)  │
│              │       │              │
│  Services    │       │  Context     │
│  ├ Incident  │       │  ├ Reducer   │
│  ├ Filter    │       │  ├ Loader    │
│  └ LiveUpdate│       │  └ LiveUpdate│
│              │       │              │
│  Components  │       │  Screens     │
│  ├ Map       │       │  ├ Map       │
│  ├ Filter    │       │  ├ List      │
│  ├ StatsBar  │       │  ├ Detail    │
│  └ States    │       │  └ Filter    │
└──────────────┘       └──────────────┘
```

### Shared Concepts

| Concept | Web | Mobile |
|---------|-----|--------|
| Data types | TypeScript interfaces | TypeScript interfaces (identical) |
| State management | Angular Signals + RxJS | React Context + useReducer |
| Filter pattern | Set-based category/severity toggles | Set-based category/severity toggles |
| Live updates | `interval()` → synthetic incidents | `setTimeout()` → synthetic incidents |
| Severity colors | `#10b981` / `#f59e0b` / `#f97316` / `#ef4444` | Same palette |
| Design theme | Dark (slate/navy), glassmorphism | Dark (slate/navy), card-based |

---

## Dataset

`incidents.json` contains ~1,500 incidents with the following schema:

```json
{
  "id": "INC-00001",
  "title": "Vehicle collision on highway",
  "category": "Accident",
  "severity": "high",
  "lat": 33.5731,
  "lng": -7.5898,
  "city": "Casablanca",
  "reportedAt": "2025-06-01T08:23:00Z"
}
```

**Categories:** Accident, Fire, Medical, Security, Infrastructure, Flood, PowerOutage  
**Severities:** low, medium, high, critical  
**Cities:** Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, and 10+ more across Morocco

---

## Challenge Requirements Checklist

### Web (7/7 ✅)

- [x] Interactive map with pan/zoom
- [x] Severity-coded markers with clustering
- [x] Heat/density map view
- [x] Live updates without viewport reset
- [x] Category & severity filtering
- [x] Loading, empty, and error states
- [x] Performance with full dataset

### Mobile (8/8 ✅)

- [x] Map screen with severity markers
- [x] List screen with pull-to-refresh & infinite scroll
- [x] Detail screen with all fields
- [x] Filter bottom sheet / modal
- [x] Live updates with badge indicator
- [x] Loading, empty, and error states
- [x] Portrait and landscape orientation
- [x] Smooth scrolling and map performance
