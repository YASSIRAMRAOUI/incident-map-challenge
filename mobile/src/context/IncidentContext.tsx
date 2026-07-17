import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  Incident,
  IncidentCategory,
  IncidentSeverity,
  FilterState,
  ALL_CATEGORIES,
  ALL_SEVERITIES,
} from '../models/incident';
import { loadIncidents } from '../services/incidentLoader';
import { startLiveUpdates } from '../services/liveUpdates';

// State types
type LoadingState = 'loading' | 'loaded' | 'error';

interface IncidentState {
  incidents: Incident[];
  loadingState: LoadingState;
  errorMessage: string;
  newIncidentCount: number;
  filters: FilterState;
}

// Action types
type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Incident[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_INCIDENT'; payload: Incident }
  | { type: 'TOGGLE_CATEGORY'; payload: IncidentCategory }
  | { type: 'TOGGLE_SEVERITY'; payload: IncidentSeverity }
  | { type: 'RESET_FILTERS' }
  | { type: 'ACKNOWLEDGE_NEW' };

// Context types
interface IncidentContextValue {
  state: IncidentState;
  filteredIncidents: Incident[];
  severityCounts: {
    total: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  loadData: () => void;
  toggleCategory: (cat: IncidentCategory) => void;
  toggleSeverity: (sev: IncidentSeverity) => void;
  resetFilters: () => void;
  acknowledgeNew: () => void;
  isCategoryActive: (cat: IncidentCategory) => boolean;
  isSeverityActive: (sev: IncidentSeverity) => boolean;
  activeFilterCount: number;
}

const initialState: IncidentState = {
  incidents: [],
  loadingState: 'loading',
  errorMessage: '',
  newIncidentCount: 0,
  filters: {
    categories: new Set(ALL_CATEGORIES),
    severities: new Set(ALL_SEVERITIES),
  },
};

function reducer(state: IncidentState, action: Action): IncidentState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loadingState: 'loading', errorMessage: '' };

    case 'LOAD_SUCCESS':
      return { ...state, loadingState: 'loaded', incidents: action.payload };

    case 'LOAD_ERROR':
      return {
        ...state,
        loadingState: 'error',
        errorMessage: action.payload,
      };

    case 'ADD_INCIDENT':
      return {
        ...state,
        incidents: [action.payload, ...state.incidents],
        newIncidentCount: state.newIncidentCount + 1,
      };

    case 'TOGGLE_CATEGORY': {
      const cats = new Set(state.filters.categories);
      if (cats.has(action.payload)) {
        cats.delete(action.payload);
      } else {
        cats.add(action.payload);
      }
      return {
        ...state,
        filters: { ...state.filters, categories: cats },
      };
    }

    case 'TOGGLE_SEVERITY': {
      const sevs = new Set(state.filters.severities);
      if (sevs.has(action.payload)) {
        sevs.delete(action.payload);
      } else {
        sevs.add(action.payload);
      }
      return {
        ...state,
        filters: { ...state.filters, severities: sevs },
      };
    }

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          categories: new Set(ALL_CATEGORIES),
          severities: new Set(ALL_SEVERITIES),
        },
      };

    case 'ACKNOWLEDGE_NEW':
      return { ...state, newIncidentCount: 0 };

    default:
      return state;
  }
}

const IncidentContext = createContext<IncidentContextValue | null>(null);

export function IncidentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadData = useCallback(() => {
    dispatch({ type: 'LOAD_START' });
    loadIncidents()
      .then((data) => dispatch({ type: 'LOAD_SUCCESS', payload: data }))
      .catch((err) =>
        dispatch({
          type: 'LOAD_ERROR',
          payload: err.message || 'Failed to load incidents',
        }),
      );
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Start live updates after data loads
  useEffect(() => {
    if (state.loadingState !== 'loaded') return;

    const stop = startLiveUpdates((incident) => {
      dispatch({ type: 'ADD_INCIDENT', payload: incident });
    });

    return stop;
  }, [state.loadingState]);

  const filteredIncidents = useMemo(() => {
    const { categories, severities } = state.filters;
    if (categories.size === 0 && severities.size === 0) return [];

    return state.incidents.filter(
      (i) => categories.has(i.category) && severities.has(i.severity),
    );
  }, [state.incidents, state.filters]);

  const severityCounts = useMemo(() => {
    return {
      total: filteredIncidents.length,
      low: filteredIncidents.filter((i) => i.severity === 'low').length,
      medium: filteredIncidents.filter((i) => i.severity === 'medium').length,
      high: filteredIncidents.filter((i) => i.severity === 'high').length,
      critical: filteredIncidents.filter((i) => i.severity === 'critical')
        .length,
    };
  }, [filteredIncidents]);

  const activeFilterCount = useMemo(() => {
    const catCount =
      ALL_CATEGORIES.length - state.filters.categories.size;
    const sevCount =
      ALL_SEVERITIES.length - state.filters.severities.size;
    return catCount + sevCount;
  }, [state.filters]);

  const toggleCategory = useCallback(
    (cat: IncidentCategory) =>
      dispatch({ type: 'TOGGLE_CATEGORY', payload: cat }),
    [],
  );
  const toggleSeverity = useCallback(
    (sev: IncidentSeverity) =>
      dispatch({ type: 'TOGGLE_SEVERITY', payload: sev }),
    [],
  );
  const resetFilters = useCallback(
    () => dispatch({ type: 'RESET_FILTERS' }),
    [],
  );
  const acknowledgeNew = useCallback(
    () => dispatch({ type: 'ACKNOWLEDGE_NEW' }),
    [],
  );

  const isCategoryActive = useCallback(
    (cat: IncidentCategory) => state.filters.categories.has(cat),
    [state.filters.categories],
  );
  const isSeverityActive = useCallback(
    (sev: IncidentSeverity) => state.filters.severities.has(sev),
    [state.filters.severities],
  );

  const value: IncidentContextValue = useMemo(
    () => ({
      state,
      filteredIncidents,
      severityCounts,
      loadData,
      toggleCategory,
      toggleSeverity,
      resetFilters,
      acknowledgeNew,
      isCategoryActive,
      isSeverityActive,
      activeFilterCount,
    }),
    [
      state,
      filteredIncidents,
      severityCounts,
      loadData,
      toggleCategory,
      toggleSeverity,
      resetFilters,
      acknowledgeNew,
      isCategoryActive,
      isSeverityActive,
      activeFilterCount,
    ],
  );

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncidents(): IncidentContextValue {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}
