import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useIncidents } from '../context/IncidentContext';
import { FilterModal } from '../components/FilterModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import {
  Incident,
  SEVERITY_COLORS,
  MOROCCO_CENTER,
} from '../models/incident';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/theme';

interface Props {
  navigation: any;
}

export function MapScreen({ navigation }: Props) {
  const {
    state,
    filteredIncidents,
    severityCounts,
    loadData,
    resetFilters,
    acknowledgeNew,
    activeFilterCount,
  } = useIncidents();

  const mapRef = useRef<MapView>(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const handleMarkerPress = useCallback(
    (incident: Incident) => {
      navigation.navigate('Detail', { incident });
    },
    [navigation],
  );

  const handleAcknowledge = useCallback(() => {
    acknowledgeNew();
  }, [acknowledgeNew]);

  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  // Defer heavy native marker list updates so UI chip taps respond instantly (0ms latency)
  const deferredIncidents = React.useDeferredValue(filteredIncidents);

  // Limit markers rendered for optimal mobile performance (first 300)
  const visibleMarkers = useMemo(() => {
    return deferredIncidents.slice(0, 300);
  }, [deferredIncidents]);

  // Disable tracksViewChanges after rendering to stop layout calculations during pan/zoom
  React.useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [deferredIncidents]);

  if (state.loadingState === 'loading') {
    return <LoadingSkeleton />;
  }

  if (state.loadingState === 'error') {
    return <ErrorState message={state.errorMessage} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsBar}>
        <View style={styles.brandRow}>
          <Text style={styles.brandIcon}>🗺️</Text>
          <Text style={styles.brandTitle}>Incident Map</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{severityCounts.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: Colors.critical }]}>
              {severityCounts.critical}
            </Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: Colors.high }]}>
              {severityCounts.high}
            </Text>
            <Text style={styles.statLabel}>High</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: Colors.medium }]}>
              {severityCounts.medium}
            </Text>
            <Text style={styles.statLabel}>Medium</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: Colors.low }]}>
              {severityCounts.low}
            </Text>
            <Text style={styles.statLabel}>Low</Text>
          </View>
        </View>
      </View>

      {/* Map or Empty State */}
      {filteredIncidents.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={MOROCCO_CENTER}
          userInterfaceStyle="dark"
          mapType="standard"
        >
          {visibleMarkers.map((incident) => (
            <IncidentMarker
              key={incident.id}
              incident={incident}
              onPress={handleMarkerPress}
              tracksViewChanges={tracksViewChanges}
            />
          ))}
        </MapView>
      )}

      {/* New Incidents Badge */}
      {state.newIncidentCount > 0 && (
        <TouchableOpacity
          style={styles.newBadge}
          onPress={handleAcknowledge}
          activeOpacity={0.8}>
          <View style={styles.newBadgeCount}>
            <Text style={styles.newBadgeCountText}>
              {state.newIncidentCount}
            </Text>
          </View>
          <Text style={styles.newBadgeText}>
            new incident{state.newIncidentCount > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}

      {/* Filter FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFilterVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.fabIcon}>⚙️</Text>
        {activeFilterCount > 0 && (
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

// Memoized individual marker component for 60fps pan/zoom performance
const IncidentMarker = React.memo(function IncidentMarker({
  incident,
  onPress,
  tracksViewChanges,
}: {
  incident: Incident;
  onPress: (incident: Incident) => void;
  tracksViewChanges: boolean;
}) {
  const size = markerSize(incident.severity);
  return (
    <Marker
      coordinate={{
        latitude: incident.lat,
        longitude: incident.lng,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={() => onPress(incident)}
      tracksViewChanges={tracksViewChanges}
    >
      <View
        style={[
          styles.marker,
          {
            backgroundColor: SEVERITY_COLORS[incident.severity],
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    </Marker>
  );
});

function markerSize(severity: string): number {
  switch (severity) {
    case 'critical':
      return 18;
    case 'high':
      return 14;
    case 'medium':
      return 11;
    default:
      return 8;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  statsBar: {
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  brandIcon: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: BorderRadius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.live,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.live,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  map: {
    flex: 1,
  },
  marker: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  newBadge: {
    position: 'absolute',
    top: 130,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.accentBg,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    borderRadius: BorderRadius.full,
  },
  newBadgeCount: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    alignItems: 'center',
  },
  newBadgeCountText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: '#fff',
  },
  newBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.accentLight,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.bgOverlay,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabIcon: {
    fontSize: 22,
  },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    alignItems: 'center',
  },
  fabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
});
