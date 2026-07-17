import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Incident, CATEGORY_ICONS, SEVERITY_COLORS } from '../models/incident';
import { SeverityBadge } from './SeverityBadge';
import { formatRelativeTime } from '../utils/formatDate';
import {
  Colors,
  Spacing,
  FontSize,
  BorderRadius,
} from '../theme/theme';

interface Props {
  incident: Incident;
  onPress: (incident: Incident) => void;
}

export const IncidentCard = memo(function IncidentCard({
  incident,
  onPress,
}: Props) {
  const severityColor = SEVERITY_COLORS[incident.severity];
  const categoryIcon = CATEGORY_ICONS[incident.category];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(incident)}
      activeOpacity={0.7}>
      <View style={[styles.severityStripe, { backgroundColor: severityColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.categoryIcon}>{categoryIcon}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {incident.title}
            </Text>
            <Text style={styles.id}>{incident.id}</Text>
          </View>
          <SeverityBadge severity={incident.severity} size="small" />
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.city}>📍 {incident.city}</Text>
          <Text style={styles.category}>{incident.category}</Text>
          <Text style={styles.time}>
            {formatRelativeTime(incident.reportedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  severityStripe: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryIcon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  id: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  city: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  category: {
    fontSize: FontSize.xs,
    color: Colors.accentLight,
    backgroundColor: Colors.accentBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    fontWeight: '600',
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
});
