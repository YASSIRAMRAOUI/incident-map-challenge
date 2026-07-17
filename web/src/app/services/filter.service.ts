import { Injectable, signal, computed } from '@angular/core';
import {
  FilterState,
  IncidentCategory,
  IncidentSeverity,
  ALL_CATEGORIES,
  ALL_SEVERITIES,
} from '../models/incident.model';

@Injectable({ providedIn: 'root' })
export class FilterService {
  private readonly _categories = signal<Set<IncidentCategory>>(new Set(ALL_CATEGORIES));
  private readonly _severities = signal<Set<IncidentSeverity>>(new Set(ALL_SEVERITIES));

  readonly categories = this._categories.asReadonly();
  readonly severities = this._severities.asReadonly();

  readonly activeFilterCount = computed(() => {
    const catCount = ALL_CATEGORIES.length - this._categories().size;
    const sevCount = ALL_SEVERITIES.length - this._severities().size;
    return catCount + sevCount;
  });

  readonly filterState = computed<FilterState>(() => ({
    categories: this._categories(),
    severities: this._severities(),
  }));

  toggleCategory(category: IncidentCategory): void {
    const current = new Set(this._categories());
    if (current.has(category)) {
      current.delete(category);
    } else {
      current.add(category);
    }
    this._categories.set(current);
  }

  toggleSeverity(severity: IncidentSeverity): void {
    const current = new Set(this._severities());
    if (current.has(severity)) {
      current.delete(severity);
    } else {
      current.add(severity);
    }
    this._severities.set(current);
  }

  selectAllCategories(): void {
    this._categories.set(new Set(ALL_CATEGORIES));
  }

  selectAllSeverities(): void {
    this._severities.set(new Set(ALL_SEVERITIES));
  }

  clearAll(): void {
    this._categories.set(new Set(ALL_CATEGORIES));
    this._severities.set(new Set(ALL_SEVERITIES));
  }

  isCategoryActive(category: IncidentCategory): boolean {
    return this._categories().has(category);
  }

  isSeverityActive(severity: IncidentSeverity): boolean {
    return this._severities().has(severity);
  }
}
