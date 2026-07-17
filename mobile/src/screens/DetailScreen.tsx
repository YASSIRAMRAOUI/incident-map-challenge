import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Incident,
  CATEGORY_ICONS,
  SEVERITY_COLORS,
} from '../models/incident';
import { SeverityBadge } from '../components/SeverityBadge';
import { formatRelativeTime, formatTimestamp } from '../utils/formatDate';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/theme';

interface Props {
  route: { params: { incident: Incident } };
}

export function DetailScreen({ route }: Props) {
  const { incident } = route.params;
  const categoryIcon = CATEGORY_ICONS[incident.category];
  const severityColor = SEVERITY_COLORS[incident.severity];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View
          style={[styles.severityBar, { backgroundColor: severityColor }]}
        />
        <View style={styles.headerContent}>
          <Text style={styles.categoryIcon}>{categoryIcon}</Text>
          <Text style={styles.title}>{incident.title}</Text>
          <Text style={styles.incidentId}>{incident.id}</Text>

          <View style={styles.badges}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {incident.category}
              </Text>
            </View>
            <SeverityBadge severity={incident.severity} />
          </View>
        </View>
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>INCIDENT DETAILS</Text>

        <DetailRow label="City" value={incident.city} icon="📍" />
        <DetailRow
          label="Coordinates"
          value={`${incident.lat.toFixed(5)}, ${incident.lng.toFixed(5)}`}
          icon="🌐"
        />
        <DetailRow
          label="Reported"
          value={formatRelativeTime(incident.reportedAt)}
          icon="🕐"
        />
        <DetailRow
          label="Timestamp"
          value={formatTimestamp(incident.reportedAt)}
          icon="📅"
          mono
        />
        <DetailRow
          label="Category"
          value={incident.category}
          icon={categoryIcon}
        />
        <DetailRow
          label="Severity"
          value={incident.severity.toUpperCase()}
          icon="⚡"
          valueColor={severityColor}
        />
      </View>

      {/* Location Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>LOCATION</Text>
        <View style={styles.locationInfo}>
          <Text style={styles.locationCity}>{incident.city}, Morocco</Text>
          <Text style={styles.locationCoords}>
            {incident.lat.toFixed(5)}° N, {Math.abs(incident.lng).toFixed(5)}°{' '}
            {incident.lng < 0 ? 'W' : 'E'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  icon: string;
  mono?: boolean;
  valueColor?: string;
}

function DetailRow({ label, value, icon, mono, valueColor }: DetailRowProps) {
  return (
    <View style={detailRowStyles.row}>
      <Text style={detailRowStyles.icon}>{icon}</Text>
      <Text style={detailRowStyles.label}>{label}</Text>
      <Text
        style={[
          detailRowStyles.value,
          mono && detailRowStyles.mono,
          valueColor ? { color: valueColor } : null,
        ]}
        numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const detailRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 16,
    width: 24,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '500',
    width: 90,
  },
  value: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
  },
  mono: {
    fontSize: FontSize.xs,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textMuted,
  },
});

import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  headerCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  severityBar: {
    height: 4,
  },
  headerContent: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  incidentId: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.accentBg,
    borderWidth: 1,
    borderColor: Colors.accentBorder,
    borderRadius: BorderRadius.sm,
  },
  categoryBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.accentLight,
  },
  detailsCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  locationInfo: {
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  locationCity: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  locationCoords: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
});
