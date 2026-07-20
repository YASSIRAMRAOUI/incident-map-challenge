# 🌐 Web Dashboard (Angular 22)

## 🚀 Quick Start

```bash
cd web
npm install
npm start
# Open http://localhost:4200/
```

---

## 💡 How to Use the Dashboard

- **Interactive Map**: Centered on Morocco. Pan and zoom across regions.
- **Marker & Cluster View**: Incidents are color-coded by severity (low=green, medium=amber, high=orange, critical=red). Zoom in on clusters to expand.
- **Heatmap Mode**: Click the **Heatmap** button in the top header to toggle dense severity heatmap visualization.
- **Filtering**: Use the left filter panel to toggle incident Categories and Severities in real time.
- **Live Feed**: New incidents stream automatically every 3–8 seconds. Click the **"N new incidents"** badge to apply updates.
- **Incident Detail**: Click any individual pin on the map to inspect full details in the bottom card.

---

## ⚙️ Key Technical Decisions & Tradeoffs

- **Mapping Library**: **MapLibre GL JS** (open-source WebGL renderer, no API key needed, hardware-accelerated clustering & heatmap).
- **State Management**: **Angular Signals** for reactive filter/UI state + **RxJS** for live incident streams.
- **SSR Compatibility**: Dynamic `import('maplibre-gl')` guarded with `isPlatformBrowser` to prevent SSR window errors.
- **Tradeoff**: Unit test suite skipped in favor of delivering all 7 functional requirements with end-to-end browser verification.
