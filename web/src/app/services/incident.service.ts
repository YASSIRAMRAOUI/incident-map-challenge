import { Injectable, signal, computed, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Incident } from '../models/incident.model';
import { FilterService } from './filter.service';
import { LiveUpdateService } from './live-update.service';
import { Subscription } from 'rxjs';

export type LoadingState = 'loading' | 'loaded' | 'error';

@Injectable({ providedIn: 'root' })
export class IncidentService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly filterService = inject(FilterService);
  private readonly liveUpdateService = inject(LiveUpdateService);
  private subscription: Subscription | null = null;

  private readonly _incidents = signal<Incident[]>([]);
  private readonly _loadingState = signal<LoadingState>('loading');
  private readonly _errorMessage = signal<string>('');
  private readonly _newIncidentCount = signal<number>(0);

  readonly incidents = this._incidents.asReadonly();
  readonly loadingState = this._loadingState.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly newIncidentCount = this._newIncidentCount.asReadonly();

  readonly filteredIncidents = computed(() => {
    const all = this._incidents();
    const filters = this.filterService.filterState();

    if (filters.categories.size === 0 && filters.severities.size === 0) {
      return [];
    }

    return all.filter(
      (incident) =>
        filters.categories.has(incident.category) &&
        filters.severities.has(incident.severity)
    );
  });

  readonly severityCounts = computed(() => {
    const filtered = this.filteredIncidents();
    return {
      low: filtered.filter((i) => i.severity === 'low').length,
      medium: filtered.filter((i) => i.severity === 'medium').length,
      high: filtered.filter((i) => i.severity === 'high').length,
      critical: filtered.filter((i) => i.severity === 'critical').length,
      total: filtered.length,
    };
  });

  readonly geoJsonData = computed(() => {
    const incidents = this.filteredIncidents();
    return {
      type: 'FeatureCollection' as const,
      features: incidents.map((incident) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [incident.lng, incident.lat],
        },
        properties: {
          id: incident.id,
          title: incident.title,
          category: incident.category,
          severity: incident.severity,
          city: incident.city,
          reportedAt: incident.reportedAt,
        },
      })),
    };
  });

  loadIncidents(): void {
    this._loadingState.set('loading');
    this.http.get<Incident[]>('/incidents.json').subscribe({
      next: (data) => {
        this._incidents.set(data);
        this._loadingState.set('loaded');
        this.startLiveUpdates();
      },
      error: (err) => {
        this._loadingState.set('error');
        this._errorMessage.set(
          err.message || 'Failed to load incident data. Please try again.'
        );
      },
    });
  }

  retryLoad(): void {
    this.loadIncidents();
  }

  acknowledgeNewIncidents(): void {
    this._newIncidentCount.set(0);
  }

  private startLiveUpdates(): void {
    this.subscription = this.liveUpdateService.newIncident$.subscribe(
      (incident) => {
        this._incidents.update((current) => [incident, ...current]);
        this._newIncidentCount.update((count) => count + 1);
      }
    );
    this.liveUpdateService.start();
  }

  ngOnDestroy(): void {
    this.liveUpdateService.stop();
    this.subscription?.unsubscribe();
  }
}
