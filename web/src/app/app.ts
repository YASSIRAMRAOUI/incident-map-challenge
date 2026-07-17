import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { LoadingSkeletonComponent } from './components/loading-skeleton/loading-skeleton.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { IncidentService } from './services/incident.service';
import { FilterService } from './services/filter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MapComponent,
    FilterPanelComponent,
    StatsBarComponent,
    LoadingSkeletonComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  readonly incidentService = inject(IncidentService);
  readonly filterService = inject(FilterService);

  ngOnInit(): void {
    this.incidentService.loadIncidents();
  }

  onToggleViewMode(): void {
    this.mapComponent?.toggleViewMode();
  }

  get isHeatmapMode(): boolean {
    return this.mapComponent?.isHeatmapMode() ?? false;
  }

  onResetFilters(): void {
    this.filterService.clearAll();
  }

  onRetry(): void {
    this.incidentService.retryLoad();
  }
}
