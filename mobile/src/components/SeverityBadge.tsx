import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IncidentSeverity, SEVERITY_COLORS } from '../models/incident';
import { BorderRadius, FontSize, Spacing } from '../theme/theme';

interface Props {
  severity: IncidentSeverity;
  size?: 'small' | 'medium';
}

export function SeverityBadge({ severity, size = 'medium' }: Props) {
  const color = SEVERITY_COLORS[severity];
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '20',
          borderColor: color + '40',
        },
        isSmall && styles.badgeSmall,
      ]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        style={[
          styles.label,
          { color },
          isSmall && styles.labelSmall,
        ]}>
        {severity.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 9,
  },
});
