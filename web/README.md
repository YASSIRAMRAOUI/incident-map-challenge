# Live Incident Map — Web Dashboard (Angular)

A production-quality interactive map dashboard that displays ~1,500 live incidents across Morocco in real time. Built for operations teams who need to see what's happening, where, and how serious it is — at a glance.

## Quick Start

```bash
cd web
npm install
npm start
# → http://localhost:4200/
```

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Map library** | [MapLibre GL JS](https://maplibre.org/) | Free, open-source, WebGL-powered renderer with native clustering and heatmap layer support. No API key needed. CARTO Dark Matter basemap chosen for the dark ops-dashboard aesthetic. |
| **State management** | Angular Signals + RxJS | Signals for fine-grained UI reactivity (filters, counts, selected incident). RxJS for async streams (live incident emission via `interval()`). Both are idiomatic Angular 22. |
| **Clustering** | MapLibre built-in source clustering | Hardware-accelerated on the GPU, handles thousands of points smoothly. Cluster radius of 50px with zoom-to-expand on click. |
| **Heatmap** | MapLibre `heatmap` layer type | Weighted by severity (critical=1.0, low=0.25). Toggleable with the marker/cluster view. Uses a green→amber→red colour ramp. |
| **SSR compatibility** | Dynamic `import('maplibre-gl')` + `isPlatformBrowser` guard | MapLibre requires the DOM. Lazy-loading the module only in the browser avoids the `window is not defined` error during Angular SSR. |
| **Architecture** | Service-per-concern with standalone components | `IncidentService` (data + state), `FilterService` (reactive filters), `LiveUpdateService` (simulated feed). All components are standalone with no shared module boilerplate. |

## Tradeoffs Accepted

- **`any` types on MapLibre interop**: Because MapLibre is dynamically imported to avoid SSR issues, some map API surfaces (`getSource`, event handlers) use `any` rather than strongly-typed generics. In production I'd create a thin typed wrapper around the MapLibre API, but it wasn't worth the time here.
- **No unit tests**: I prioritized shipping all 7 functional requirements with a polished UI over writing tests. In production, the services (especially filtering logic and live-update generation) would be fully unit-tested, and the map integration would get a basic smoke test.
- **Timer-based live updates instead of WebSocket**: The challenge says "simulate", so `interval()` suffices. A real implementation would use a WebSocket or SSE connection with reconnection/backoff logic.

## What I'd Do Next

1. **Marker click → detail panel on mobile viewports**: Add a bottom-sheet variant for narrow screens.
2. **Date range filter**: The data has `reportedAt` timestamps — add a date picker to the filter panel.
3. **Incident search**: Full-text search across title, city, and ID.
4. **Offline support**: Service worker + IndexedDB cache for the last-fetched dataset.
5. **Unit + E2E tests**: Vitest for services, Playwright for critical user flows.
6. **Performance at 10k+ incidents**: Switch from MapLibre source clustering to [Supercluster](https://github.com/mapbox/supercluster) in a Web Worker for off-main-thread computation.

## How I'd Approach the Mobile Version

- **Platform**: React Native (already scaffolded in `../mobile/`).
- **Map SDK**: `react-native-maps` with MapView clustering, or `@maplibre/maplibre-react-native` to reuse the same tile style.
- **State management**: Zustand or React Context + `useReducer` for the same filter/incident state pattern.
- **Data model**: The TypeScript interfaces (`Incident`, `IncidentCategory`, `IncidentSeverity`) would be shared as-is — same shapes, same enums.
- **Navigation**: React Navigation with bottom tabs (Map, List) and a stack for Detail.
- **List screen**: `FlatList` with `onEndReached` for infinite scroll, pull-to-refresh via `RefreshControl`.
- **Filters**: Bottom sheet (`@gorhom/bottom-sheet`) with the same chip-toggle pattern.
- **Live updates**: Same `setInterval` approach, with a "N new incidents" toast using `react-native-toast-message`.

## Features Implemented

All 7 functional requirements from the challenge:

1. ✅ **Interactive map** — Full-screen MapLibre GL, centered on Morocco, pan & zoom
2. ✅ **Severity-coded markers** — Color (green→amber→orange→red) and size by severity, with clustering
3. ✅ **Heat/density view** — Toggleable heatmap layer weighted by severity
4. ✅ **Live updates** — New incidents every 3–8 seconds without resetting viewport
5. ✅ **Filtering** — Category multi-select + severity multi-select, reactive map updates
6. ✅ **State handling** — Loading skeleton, empty state ("No incidents match"), error state with retry
7. ✅ **Performance** — MapLibre GPU clustering handles 1,500+ incidents smoothly

### Bonus
- Pulsing "LIVE" indicator
- New incident count badge with acknowledge
- Incident detail panel on marker click
- Collapsible filter panel
- Dark theme with glassmorphism panels
- Responsive layout

## Project Structure

```
web/src/app/
├── models/
│   └── incident.model.ts          # Types, enums, color/icon mappings
├── services/
│   ├── incident.service.ts        # Data loading, filtering, GeoJSON conversion
│   ├── filter.service.ts          # Reactive filter state (signals)
│   └── live-update.service.ts     # Simulated real-time incident feed
├── components/
│   ├── map/                       # MapLibre GL map + detail panel
│   ├── filter-panel/              # Category & severity chip filters
│   ├── stats-bar/                 # Header with counts, live badge, view toggle
│   ├── loading-skeleton/          # Loading state overlay
│   ├── empty-state/               # No-results state with reset button
│   └── error-state/               # Error state with retry button
├── app.ts                         # Root component, wires everything together
├── app.html                       # Dashboard layout
├── app.scss                       # Shell styles
└── app.config.ts                  # Angular providers (HttpClient, Router)
```
