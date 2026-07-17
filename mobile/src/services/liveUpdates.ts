import {
  Incident,
  IncidentCategory,
  IncidentSeverity,
  ALL_CATEGORIES,
  ALL_SEVERITIES,
} from '../models/incident';

const MOROCCAN_CITIES = [
  { city: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { city: 'Rabat', lat: 34.0209, lng: -6.8416 },
  { city: 'Marrakech', lat: 31.6295, lng: -7.9811 },
  { city: 'Fès', lat: 34.0331, lng: -5.0003 },
  { city: 'Tanger', lat: 35.7595, lng: -5.834 },
  { city: 'Agadir', lat: 30.4278, lng: -9.5981 },
  { city: 'Meknès', lat: 33.8935, lng: -5.5473 },
  { city: 'Oujda', lat: 34.6814, lng: -1.9086 },
  { city: 'Kénitra', lat: 34.261, lng: -6.5802 },
  { city: 'Tétouan', lat: 35.5889, lng: -5.3626 },
  { city: 'Nador', lat: 35.1688, lng: -2.9289 },
  { city: 'Safi', lat: 32.2994, lng: -9.2372 },
  { city: 'El Jadida', lat: 33.2316, lng: -8.5007 },
  { city: 'Beni Mellal', lat: 32.3372, lng: -6.3498 },
  { city: 'Taza', lat: 34.21, lng: -4.0101 },
];

const INCIDENT_TITLES: Record<IncidentCategory, string[]> = {
  Accident: [
    'Vehicle collision on highway',
    'Pedestrian incident',
    'Multi-vehicle pileup',
    'Motorcycle accident',
    'Bus collision reported',
  ],
  Fire: [
    'Building fire reported',
    'Warehouse fire — crews dispatched',
    'Forest fire near residential area',
    'Kitchen fire in apartment complex',
    'Industrial fire alert',
  ],
  Medical: [
    'Injury requiring evacuation',
    'Medical emergency — ambulance dispatched',
    'Heat stroke case reported',
    'Cardiac emergency at public venue',
    'Mass casualty incident drill',
  ],
  Security: [
    'Suspicious package',
    'Unauthorized perimeter breach',
    'Crowd control situation',
    'Vandalism reported at public facility',
    'Theft reported near market',
  ],
  Infrastructure: [
    'Road collapse reported',
    'Bridge structural alert',
    'Water main break',
    'Sinkhole forming on road',
    'Building structural concern',
  ],
  Flood: [
    'Flash flooding in low area',
    'River overflow warning',
    'Urban flooding — roads impassable',
    'Flood evacuation notice',
    'Drainage system overflow',
  ],
  PowerOutage: [
    'Widespread power outage',
    'Transformer failure',
    'Grid instability detected',
    'Neighborhood blackout reported',
    'Power line down — area secured',
  ],
};

let counter = 2000;
let intervalId: ReturnType<typeof setInterval> | null = null;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedSeverity(): IncidentSeverity {
  const rand = Math.random();
  if (rand < 0.4) return 'low';
  if (rand < 0.7) return 'medium';
  if (rand < 0.9) return 'high';
  return 'critical';
}

export function generateIncident(): Incident {
  const category = randomFrom(ALL_CATEGORIES);
  const severity = weightedSeverity();
  const location = randomFrom(MOROCCAN_CITIES);
  const title = randomFrom(INCIDENT_TITLES[category]);
  counter++;

  return {
    id: `INC-LIVE-${String(counter).padStart(5, '0')}`,
    title,
    category,
    severity,
    lat: location.lat + (Math.random() - 0.5) * 0.1,
    lng: location.lng + (Math.random() - 0.5) * 0.1,
    city: location.city,
    reportedAt: new Date().toISOString(),
  };
}

export function startLiveUpdates(
  onNewIncident: (incident: Incident) => void,
): () => void {
  const tick = () => {
    onNewIncident(generateIncident());
    // Vary interval between 3-8 seconds
    const nextInterval = 3000 + Math.random() * 5000;
    intervalId = setTimeout(tick, nextInterval);
  };

  const initialDelay = 3000 + Math.random() * 5000;
  intervalId = setTimeout(tick, initialDelay);

  return () => {
    if (intervalId) {
      clearTimeout(intervalId);
      intervalId = null;
    }
  };
}
