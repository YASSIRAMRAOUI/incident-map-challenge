import { StyleSheet } from 'react-native';

export const Colors = {
  // Background
  bg: '#0f172a',
  bgCard: '#1e293b',
  bgCardHover: '#334155',
  bgOverlay: 'rgba(15, 23, 42, 0.92)',

  // Text
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  // Accent
  accent: '#6366f1',
  accentLight: '#a5b4fc',
  accentBg: 'rgba(99, 102, 241, 0.15)',
  accentBorder: 'rgba(99, 102, 241, 0.3)',

  // Severity
  low: '#10b981',
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',

  // UI
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  tabBarBg: '#0f172a',
  tabBarBorder: 'rgba(255, 255, 255, 0.06)',

  // Status
  live: '#10b981',
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.15)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const commonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
});
