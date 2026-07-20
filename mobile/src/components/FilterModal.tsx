import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  ALL_CATEGORIES,
  ALL_SEVERITIES,
  CATEGORY_ICONS,
  SEVERITY_COLORS,
  IncidentCategory,
  IncidentSeverity,
} from '../models/incident';
import { useIncidents } from '../context/IncidentContext';
import { Colors, Spacing, FontSize, BorderRadius } from '../theme/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal = React.memo(function FilterModal({ visible, onClose }: Props) {
  const {
    toggleCategory,
    toggleSeverity,
    resetFilters,
    isCategoryActive,
    isSeverityActive,
    activeFilterCount,
  } = useIncidents();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Category Section */}
            <Text style={styles.sectionTitle}>CATEGORY</Text>
            <View style={styles.chipGroup}>
              {ALL_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    isCategoryActive(cat) && styles.chipActive,
                  ]}
                  onPress={() => toggleCategory(cat)}
                  activeOpacity={0.7}>
                  <Text style={styles.chipIcon}>
                    {CATEGORY_ICONS[cat]}
                  </Text>
                  <Text
                    style={[
                      styles.chipLabel,
                      isCategoryActive(cat) && styles.chipLabelActive,
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Severity Section */}
            <Text style={styles.sectionTitle}>SEVERITY</Text>
            <View style={styles.chipGroup}>
              {ALL_SEVERITIES.map((sev) => {
                const color = SEVERITY_COLORS[sev];
                const active = isSeverityActive(sev);
                return (
                  <TouchableOpacity
                    key={sev}
                    style={[
                      styles.chip,
                      active && {
                        backgroundColor: color + '20',
                        borderColor: color + '40',
                      },
                    ]}
                    onPress={() => toggleSeverity(sev)}
                    activeOpacity={0.7}>
                    <View
                      style={[styles.severityDot, { backgroundColor: color }]}
                    />
                    <Text
                      style={[
                        styles.chipLabel,
                        active && { color },
                      ]}>
                      {sev}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={resetFilters}>
                <Text style={styles.resetBtnText}>Reset all filters</Text>
              </TouchableOpacity>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.bgCardHover,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.sm,
  },
  closeBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  chipActive: {
    backgroundColor: Colors.accentBg,
    borderColor: Colors.accentBorder,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipLabelActive: {
    color: Colors.accentLight,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  resetBtnText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: '#f87171',
  },
});
