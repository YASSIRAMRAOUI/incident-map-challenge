import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/theme';

export function LoadingSkeleton() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.accent} />
      <Text style={styles.title}>Loading incidents</Text>
      <Text style={styles.subtitle}>Connecting to operations feed...</Text>
      <View style={styles.skeletonBars}>
        <View style={[styles.bar, { width: '100%' }]} />
        <View style={[styles.bar, { width: '60%' }]} />
        <View style={[styles.bar, { width: '80%' }]} />
      </View>
    </View>
  );
}

export function ListLoadingSkeleton() {
  return (
    <View style={styles.listContainer}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonStripe} />
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonLine, { width: '70%' }]} />
            <View style={[styles.skeletonLine, { width: '40%', height: 8 }]} />
            <View style={styles.skeletonRow}>
              <View style={[styles.skeletonLine, { width: '30%', height: 8 }]} />
              <View style={[styles.skeletonLine, { width: '20%', height: 8 }]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    padding: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  skeletonBars: {
    width: 200,
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  bar: {
    height: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.sm,
    opacity: 0.6,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingTop: Spacing.sm,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    height: 72,
  },
  skeletonStripe: {
    width: 4,
    backgroundColor: Colors.bgCardHover,
  },
  skeletonContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  skeletonLine: {
    height: 12,
    backgroundColor: Colors.bgCardHover,
    borderRadius: BorderRadius.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
