# 🌐 Live Incident Map — Web Dashboard (Angular)

A production-minded, interactive map dashboard that displays ~1,500 live incidents across Morocco in real time. Built for operations teams who need to see what is happening, where, and how serious it is at a glance.

---

## 📋 Prerequisites

Before running the web application, ensure you have:
- **Node.js**: `v18.0.0` or higher (tested on Node v22)
- **npm**: `v9.0.0` or higher

---

## 🚀 Quick Start

```bash
cd web
npm install
npm start
```

After starting, navigate to **`http://localhost:4200/`** in your browser.

---

## 💡 How to Use the Dashboard

- **Interactive Map**: Centered on Morocco on load. Full pan and zoom capabilities.
- **Severity-Coded Markers & Clusters**: Incidents are color-coded by severity (**Green** = Low, **Amber** = Medium, **Orange** = High, **Red** = Critical). GPU-accelerated clusters expand automatically when clicked.
- **Heatmap Mode**: Click the **Heatmap** button in the header bar to switch from marker view to a density heatmap layer.
- **Reactive Filters**: Use the left side panel to filter by Category (*Accident, Fire, Medical, Security, Infrastructure, Flood, PowerOutage*) and Severity. The map updates dynamically.
- **Live Incident Stream**: New synthetic incidents stream every 3–8 seconds without disrupting your map position. A top badge indicates new arrivals; click it to acknowledge and center.
- **Incident Details**: Click any individual unclustered marker to display full incident metadata in a dark card.

---

## ⚙️ Key Technical Decisions & Architecture

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Map Engine** | [MapLibre GL JS](https://maplibre.org/) | Open-source, WebGL-powered renderer with native GPU clustering and heatmap layers. CARTO Dark Matter basemap chosen for ops-control theme. No API key required. |
| **State Management** | Angular Signals + RxJS | Signals handle fine-grained UI reactivity (active filters, incident counts, loading states). RxJS manages async streams (`interval()` simulation for live feed). |
| **SSR Compatibility** | Dynamic `import('maplibre-gl')` | MapLibre requires the browser DOM (`window`). Module is lazy-loaded only in the browser via `isPlatformBrowser` guard to prevent SSR hydration crashes. |
| **Component Model** | Standalone Components | Modern Angular architecture with clean service-per-concern separation (`IncidentService`, `FilterService`, `LiveUpdateService`). |

---

## ⚖️ Tradeoffs Accepted

1. **`any` types on dynamic MapLibre import**: Lazy-loading MapLibre dynamically for SSR safety introduces some `any` casts on map source instances. In production, a thin typed wrapper around MapLibre GL JS would be added.
2. **Timer-based Live Updates**: Used an `interval()` simulation rather than WebSockets to fulfill the challenge prompt ("simulate incidents arriving in real time").
3. **Prioritized Feature Completeness over Unit Tests**: Focused on shipping all 7 functional requirements with end-to-end browser verification rather than building out Vitest specs.

---

## 🔮 What I'd Do Next

1. **Date Range Filter**: The dataset includes ISO `reportedAt` timestamps — add a date picker to the filter panel.
2. **Full-Text Search**: Search incidents by ID, title, or city.
3. **Supercluster in Web Worker**: Offload clustering calculation off the main thread for 10,000+ incidents.
4. **Offline Support**: Cache dataset via Service Worker & IndexedDB.

---

## 🎯 Challenge Requirements Checklist

- [x] **Interactive map** — Full-screen, pan/zoom, centered on Morocco
- [x] **Markers & Severity** — Color (green→red) and size coding with clustering
- [x] **Heatmap view** — Density heatmap layer, toggleable from marker view
- [x] **Live updates** — Synthetic stream every 3-8s preserving map position
- [x] **Filtering** — Category & severity multi-select updating reactively
- [x] **States** — Loading skeleton, empty state with reset, error state with retry
- [x] **Performance** — MapLibre GPU clustering handles 1,500+ markers smoothly
