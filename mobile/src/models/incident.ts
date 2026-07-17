export type IncidentCategory =
  | 'Accident'
  | 'Fire'
  | 'Medical'
  | 'Security'
  | 'Infrastructure'
  | 'Flood'
  | 'PowerOutage';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  lat: number;
  lng: number;
  city: string;
  reportedAt: string;
}

export const ALL_CATEGORIES: IncidentCategory[] = [
  'Accident',
  'Fire',
  'Medical',
  'Security',
  'Infrastructure',
  'Flood',
  'PowerOutage',
];

export const ALL_SEVERITIES: IncidentSeverity[] = [
  'low',
  'medium',
  'high',
  'critical',
];

export const SEVERITY_COLORS: Record<IncidentSeverity, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export const SEVERITY_BG_COLORS: Record<IncidentSeverity, string> = {
  low: '#10b98120',
  medium: '#f59e0b20',
  high: '#f9731620',
  critical: '#ef444420',
};

export const CATEGORY_ICONS: Record<IncidentCategory, string> = {
  Accident: '🚗',
  Fire: '🔥',
  Medical: '🏥',
  Security: '🔒',
  Infrastructure: '🏗️',
  Flood: '🌊',
  PowerOutage: '⚡',
};

export interface FilterState {
  categories: Set<IncidentCategory>;
  severities: Set<IncidentSeverity>;
}

export const MOROCCO_CENTER = {
  latitude: 31.7917,
  longitude: -7.0926,
  latitudeDelta: 8,
  longitudeDelta: 8,
};
