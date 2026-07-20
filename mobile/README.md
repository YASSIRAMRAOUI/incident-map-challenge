# 📱 Mobile App (React Native + Expo SDK 54)

## 🚀 Quick Start

```bash
cd mobile
npm install
npx expo start
```

1. Install **Expo Go** on your mobile device (Android / iOS).
2. Scan the terminal QR code in Expo Go (or Camera on iOS).

> **Note:** Built for **Expo SDK 54**. If phone & PC are on different Wi-Fi networks, run `npx expo start --tunnel`. To clear cache: `npx expo start -c`.

---

## 🔑 Google Maps API Key Setup

Android map tiles require a Google Maps API Key.

### How to Get an API Key:
1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Create a project → Go to **APIs & Services > Library**.
3. Search for **Maps SDK for Android** and click **Enable**.
4. Go to **APIs & Services > Credentials** → Click **+ Create Credentials > API Key**.
5. Copy the generated key.

### Configuration:
Create or edit `.env` in the `mobile/` directory:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```
*(On iOS, Apple Maps is used automatically out of the box).*

---

## 💡 How to Use the App

- **Map Screen**: Pan/zoom Morocco. Incidents render as color-coded severity markers (green=low, amber=medium, orange=high, red=critical). Tap a marker to open details.
- **List Screen**: Scroll incidents ordered newest-first. Pull down to refresh. Tap any card for full details.
- **Filters**: Tap the floating **⚙️ Filter** button to filter by Category or Severity.
- **Live Feed**: New incidents arrive automatically every 3–8 seconds with an **"N new"** notification badge.

---

## ⚙️ Key Technical Decisions & Tradeoffs

- **Architecture**: React Context + `useReducer` for unidirectional state management.
- **Performance**: Dynamic `tracksViewChanges` freezing (disables layout recalculations after 800ms) for 60fps pan/zoom.
- **Expo Go Compatibility**: Configured with SDK 54 and locked native deps to run cleanly without native builds.
