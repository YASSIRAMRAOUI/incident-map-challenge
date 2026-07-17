import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterService } from '../../services/filter.service';
import {
  ALL_CATEGORIES,
  ALL_SEVERITIES,
  SEVERITY_COLORS,
  CATEGORY_ICONS,
  IncidentCategory,
  IncidentSeverity,
} from '../../models/incident.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
})
export class FilterPanelComponent {
  readonly filterService = inject(FilterService);
  readonly isCollapsed = signal(false);

  readonly allCategories = ALL_CATEGORIES;
  readonly allSeverities = ALL_SEVERITIES;
  readonly severityColors = SEVERITY_COLORS;
  readonly categoryIcons = CATEGORY_ICONS;

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }

  toggleCategory(cat: IncidentCategory): void {
    this.filterService.toggleCategory(cat);
  }

  toggleSeverity(sev: IncidentSeverity): void {
    this.filterService.toggleSeverity(sev);
  }

  clearAll(): void {
    this.filterService.clearAll();
  }

  isCategoryActive(cat: IncidentCategory): boolean {
    return this.filterService.isCategoryActive(cat);
  }

  isSeverityActive(sev: IncidentSeverity): boolean {
    return this.filterService.isSeverityActive(sev);
  }
}
