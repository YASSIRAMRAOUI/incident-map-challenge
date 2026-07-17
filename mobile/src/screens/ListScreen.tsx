import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useIncidents } from '../context/IncidentContext';
import { IncidentCard } from '../components/IncidentCard';
import { FilterModal } from '../components/FilterModal';
import { ListLoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Incident } from '../models/incident';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/theme';

const PAGE_SIZE = 50;

interface Props {
  navigation: any;
}

export function ListScreen({ navigation }: Props) {
  const {
    state,
    filteredIncidents,
    severityCounts,
    loadData,
    resetFilters,
    acknowledgeNew,
    activeFilterCount,
  } = useIncidents();

  const [filterVisible, setFilterVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);

  // Paginated data
  const displayedIncidents = useMemo(() => {
    return filteredIncidents.slice(0, displayCount);
  }, [filteredIncidents, displayCount]);

  const handlePress = useCallback(
    (incident: Incident) => {
      navigation.navigate('Detail', { incident });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (displayCount < filteredIncidents.length) {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filteredIncidents.length));
    }
  }, [displayCount, filteredIncidents.length]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    acknowledgeNew();
    setDisplayCount(PAGE_SIZE);
    setTimeout(() => setRefreshing(false), 500);
  }, [acknowledgeNew]);

  const renderItem = useCallback(
    ({ item }: { item: Incident }) => (
      <IncidentCard incident={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: Incident) => item.id, []);

  if (state.loadingState === 'loading') {
    return <ListLoadingSkeleton />;
  }

  if (state.loadingState === 'error') {
    return <ErrorState message={state.errorMessage} onRetry={loadData} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Incidents</Text>
          <Text style={styles.headerCount}>
            {severityCounts.total} total
          </Text>
        </View>
        {state.newIncidentCount > 0 && (
          <TouchableOpacity
            style={styles.newBadge}
            onPress={acknowledgeNew}>
            <View style={styles.newBadgeCount}>
              <Text style={styles.newBadgeCountText}>
                {state.newIncidentCount}
              </Text>
            </View>
            <Text style={styles.newBadgeText}>new</Text>
          </TouchableOpacity>
        )}
      </View>

      {filteredIncidents.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <FlatList
          data={displayedIncidents}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.accent}
              colors={[Colors.accent]}
              progressBackgroundColor={Colors.bgCard}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          ListFooterComponent={
            displayCount < filteredIncidents.length ? (
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Showing {displayCount} of {filteredIncidents.length}
                </Text>
              </View>
            ) : null
          }
        />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  newBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.accentBg,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    borderRadius: BorderRadius.full,
  },
  newBadgeCount: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    alignItems: 'center',
  },
  newBadgeCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  newBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.accentLight,
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
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
