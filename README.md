# 🗺️ Live Incident Map (Web + Mobile)

Full-stack incident monitoring application visualizing ~1,500 live incidents across Morocco for desktop operators and mobile field workers.

```
incident-map-challenge/
├── web/           # Angular 22 Web Dashboard
├── mobile/        # React Native + Expo Mobile App
└── incidents.json # Shared incident dataset
```

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
- Open **Expo Go** on your phone (or Camera on iOS) and scan the terminal QR code.
- If phone and PC are on separate networks: `npx expo start --tunnel`
- Clear cache if needed: `npx expo start -c`

---

## 🔑 Google Maps API Key Setup (Mobile Android)

Android map rendering requires a Google Maps API Key.

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)** → Create a project.
2. Under **APIs & Services > Library**, search **Maps SDK for Android** and click **Enable**.
3. Go to **APIs & Services > Credentials** → Click **+ Create Credentials > API Key**.
4. Create `mobile/.env` and add your key:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```
*(iOS Apple Maps works out of the box without an API key).*

---

## 💡 How to Use the Apps

### Web Dashboard (`http://localhost:4200/`)
- **Map & Heatmap**: View Morocco incidents. Toggle between Marker/Cluster view and Heatmap mode.
- **Filters**: Select categories & severities on the left panel to update the map in real time.
- **Live Feed**: New incidents stream every 3–8s; click the top badge to acknowledge.

### Mobile App (Expo Go)
- **Map & List Tabs**: Switch between interactive Morocco map and paginated incident list.
- **Filter Modal**: Tap **⚙️ Filter** to filter incidents. Both map and list update reactively.
- **Details**: Tap any marker or list card to view complete incident metadata.

---

## ⚙️ Key Technical Decisions & Tradeoffs

- **Web**: Angular 22 + MapLibre GL JS (WebGL rendering, GPU clustering, Signals + RxJS reactivity).
- **Mobile**: Expo SDK 54 + React Native Maps (Context + `useReducer`, dynamic marker freezing for 60fps pan/zoom).
- **Tradeoff**: Timer-based live update simulation (`interval`/`setTimeout`) used in place of WebSockets.
