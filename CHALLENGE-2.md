# Frontend Technical Challenge — Live Incident Map (Web + Mobile)

## Context

Our operations team monitors incidents happening across Morocco in real time. Some operators work from a desktop dashboard in a control room; others are in the field and only have their phone. We want both experiences to plot incident data on an interactive map so an operator can see what is happening, where, and how serious it is — at a glance, regardless of which device they're on.

Your task is to build a small but production-minded application that does this: a **web dashboard (Angular)** and a **mobile app (Android or iOS)**. We care less about how many features you finish and more about how you think: the decisions you make, the tradeoffs you accept, and the quality of what you ship.

You may build **both** versions, or focus on **one** and speak clearly in your README about how you'd approach the other — see "Time expectation" below.

## The task

Build an application (web, mobile, or both) that displays a live, interactive map of Morocco with incident data plotted on it, plus the supporting screens an operator needs to make sense of that data.

You are given a dataset (`incidents.json`) of incidents, each with a location, category, severity, and timestamp. Load it, show it on a map, and make it useful.

## The dataset

`incidents.json` is an array of \~1,500 incident objects with this shape (assume it could grow to several thousand):

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

Field notes:

- `category` — one of: Accident, Fire, Medical, Security, Infrastructure, Flood, PowerOutage.
- `severity` — one of: low, medium, high, critical.
- `lat` / `lng` — WGS84 decimal degrees.
- `reportedAt` — ISO 8601 (UTC). The array is sorted newest-first.

You may reshape, extend, or duplicate the data if it helps you (for example, to generate additional incidents for your "live updates" simulation or to stress-test performance). Use the same dataset for both platforms if you build both, so the experiences stay comparable.

---

## Web Version (Angular)

### Functional requirements

1. **Interactive map.** Full-screen, pan and zoom. Centered on Morocco on load. Do not use Google Maps — choose your own mapping library and basemap (e.g. Leaflet, MapLibre, OpenLayers…).
2. **Markers.** Plot each incident on the map. The visual should convey the incident's severity (e.g. colour or size) in some sensible way.
3. **Heat / density view.** Provide a second view mode that shows the density of incidents as a heat map or aggregated zones, toggleable from the marker view.
4. **Live updates.** Simulate incidents arriving in real time (e.g. a timer or a mock WebSocket that emits new incidents every few seconds). New incidents must appear on the map without a full reload and without resetting the user's current pan/zoom.
5. **Filtering.** Let the user filter incidents by category and severity. The map updates reactively as filters change.
6. **States.** Handle loading, empty (no results after filtering), and error states explicitly.
7. **Performance.** The map should stay responsive with the full dataset (\~1,500 incidents, growing to several thousand). Marker clustering or another performance strategy is encouraged.

### Technical constraints

- Angular (any recent version). Use the Angular idioms you'd use in real code.
- TypeScript, properly typed — no `any` soup.
- Any mapping library except Google Maps.
- Any styling approach you like. A clean, usable UI matters, but we are not judging visual polish as heavily as engineering.
- Feel free to use RxJS, signals, standalone components, etc. — your choice.

---

## Mobile Version (Android — Jetpack Compose/Kotlin, or iOS — SwiftUI/Swift)

### Functional requirements

1. **Map screen.** Full-screen interactive map, centered on Morocco on load, pan and zoom. Markers convey severity (colour and/or size), with clustering so the view stays legible and responsive at \~1,500+ incidents.
2. **List screen.** A separate screen listing incidents (newest first), with pull-to-refresh and infinite scroll / lazy loading. Tapping an item or a map marker opens the detail screen.
3. **Detail screen.** Shows all fields for a single incident (title, category, severity, city, reported time, coordinates) nicely formatted.
4. **Filters.** Accessible via a bottom sheet or modal: category (multi-select), severity, and date range. Both the map and the list update reactively when filters change.
5. **Live updates.** Simulate incidents arriving in real time (timer or mock WebSocket). New incidents should appear on the map and list without disrupting the user's current map position or scroll offset — a subtle indicator (e.g. a badge or toast: "3 new incidents") is a nice touch but not required.
6. **States.** Loading skeletons (not just spinners), an empty state ("No incidents match your filters"), and an error state.
7. **Orientation.** Works correctly in both portrait and landscape.
8. **Performance.** Smooth scrolling and map interaction with the full dataset; use clustering, lazy lists, and pagination as appropriate.

### Technical constraints

- Android: Kotlin + Jetpack Compose. iOS: Swift + SwiftUI. Pick whichever platform you're strongest in — we're not grading iOS vs. Android.
- Any mapping library/SDK (MapKit, Google Maps, MapLibre, osmdroid, etc.) — your choice, just note why.
- Use the state management / architecture pattern you'd use in production (e.g. MVVM, MVI, unidirectional data flow) and be ready to explain it.
- Properly typed / idiomatic Kotlin or Swift — no stringly-typed or untyped shortcuts where a real type would do.

### Bonus (either platform, optional)

- Persist last-used filters between app launches.
- Offline support — cache the last successful fetch and show it if the network is unavailable.
- Smooth chart or transition animations.
- Haptic feedback on key interactions.

---

## What to deliver

- A Git repository (or a zip) per platform you build, with the running app(s) and clear run instructions (e.g. `npm install && npm start` for web; how to open/run the mobile project — Xcode/Android Studio version, any setup steps).
- A short README (max one page per platform, or one combined page if you only build one) covering: 
  - the key technical decisions you made and why,
  - at least one tradeoff you deliberately accepted,
  - what you'd do next if you had more time,
  - if you only built one platform: how you'd approach the other, at a decision level (mapping library/SDK, state management, how you'd reuse the data model).

## Time expectation

Building both platforms well is a meaningful chunk of work. Budget roughly:

- **Web only or Mobile only:** 3–4 hours.
- **Both:** treat it like a one-week take-home — spend the time where it's most valuable, and be explicit in your README about what you prioritized and why.

A partial solution with clear reasoning beats a feature-complete one with no explanation. If you run out of time on either platform, just note in the README what remains and how you'd approach it.

## How we evaluate

We look at the whole picture, roughly in this order:

- Correctness and quality of the map integration and the live-update behaviour, on whichever platform(s) you submit.
- Reactive/state handling (filters, updates) and clean async code.
- Performance approach with a large number of incidents (clustering, virtualization/lazy lists, pagination).
- Handling of loading / empty / error states.
- Code readability, structure, and typing/idioms appropriate to the platform (Angular idioms for web; Compose/SwiftUI idioms for mobile).
- The clarity of your README and the quality of your reasoning, including how you'd approach the platform you didn't build.
- Attention to detail and to the product's context (this is a tool for operators making real-time decisions).

## Interview discussion topics

- Walk me through how filtering works end-to-end, on the platform you built.
- Why did you choose this mapping library/SDK? What would you reconsider at 10,000+ incidents?
- Why this state management / architecture pattern? What would break at scale?
- Show me a component/screen you're proud of, and one you'd refactor.
- How did you handle the "new incident arrives without losing the user's pan/zoom/scroll position" requirement?
- If we asked you to add offline support (or, if you built it, to harden it), where would you start?
- If we asked you to build the other platform, what would you keep from your current data layer, and what would you rebuild?

---

Good luck — we're looking forward to seeing how you approach it.