import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  effect,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IncidentService } from '../../services/incident.service';
import { SEVERITY_COLORS, Incident, CATEGORY_ICONS } from '../../models/incident.model';

type MaplibreModule = typeof import('maplibre-gl');
let maplibregl: MaplibreModule;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private map: any;
  private popup: any = null;
  private readonly incidentService = inject(IncidentService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly isHeatmapMode = signal(false);
  readonly selectedIncident = signal<Incident | null>(null);

  private dataEffect = effect(() => {
    const geoJson = this.incidentService.geoJsonData();
    if (this.isBrowser) {
      this.updateMapData(geoJson);
    }
  });

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      maplibregl = await import('maplibre-gl');
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  toggleViewMode(): void {
    this.isHeatmapMode.update((v) => !v);
    if (this.map.getLayer('incidents-heat')) {
      this.map.setLayoutProperty(
        'incidents-heat',
        'visibility',
        this.isHeatmapMode() ? 'visible' : 'none'
      );
    }
    if (this.map.getLayer('unclustered-point')) {
      this.map.setLayoutProperty(
        'unclustered-point',
        'visibility',
        this.isHeatmapMode() ? 'none' : 'visible'
      );
    }
    if (this.map.getLayer('clusters')) {
      this.map.setLayoutProperty(
        'clusters',
        'visibility',
        this.isHeatmapMode() ? 'none' : 'visible'
      );
    }
    if (this.map.getLayer('cluster-count')) {
      this.map.setLayoutProperty(
        'cluster-count',
        'visibility',
        this.isHeatmapMode() ? 'none' : 'visible'
      );
    }
  }

  closeDetail(): void {
    this.selectedIncident.set(null);
    this.popup?.remove();
    this.popup = null;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  getCategoryIcon(category: string): string {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '📍';
  }

  getSeverityColor(severity: string): string {
    return SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || '#6b7280';
  }

  private initMap(): void {
    const ml = (maplibregl as any).default || maplibregl;

    this.map = new ml.Map({
      container: this.mapContainer.nativeElement,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [-7.0926, 31.7917],
      zoom: 5.5,
      minZoom: 4,
      maxZoom: 18,
      attributionControl: false,
    });

    this.map.addControl(
      new ml.NavigationControl({ showCompass: true }),
      'bottom-right'
    );

    this.map.addControl(
      new ml.AttributionControl({ compact: true }),
      'bottom-left'
    );

    this.map.on('load', () => {
      this.addMapLayers();
      // trigger initial data load
      const geoJson = this.incidentService.geoJsonData();
      this.updateMapData(geoJson);
    });
  }

  private addMapLayers(): void {
    // Add GeoJSON source with clustering
    this.map.addSource('incidents', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Heatmap source (separate, no clustering)
    this.map.addSource('incidents-heat-source', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });

    // --- Heatmap Layer ---
    this.map.addLayer({
      id: 'incidents-heat',
      type: 'heatmap',
      source: 'incidents-heat-source',
      layout: {
        visibility: 'none',
      },
      paint: {
        'heatmap-weight': [
          'match',
          ['get', 'severity'],
          'critical', 1,
          'high', 0.75,
          'medium', 0.5,
          'low', 0.25,
          0.3,
        ],
        'heatmap-intensity': [
          'interpolate', ['linear'], ['zoom'],
          0, 1,
          9, 3,
        ],
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0, 'rgba(0, 0, 0, 0)',
          0.1, 'rgba(16, 185, 129, 0.4)',
          0.3, 'rgba(245, 158, 11, 0.6)',
          0.5, 'rgba(249, 115, 22, 0.7)',
          0.7, 'rgba(239, 68, 68, 0.8)',
          1, 'rgba(220, 38, 38, 1)',
        ],
        'heatmap-radius': [
          'interpolate', ['linear'], ['zoom'],
          0, 15,
          9, 30,
          15, 50,
        ],
        'heatmap-opacity': 0.85,
      },
    });

    // --- Cluster Circles ---
    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'incidents',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step', ['get', 'point_count'],
          '#6366f1', 10,
          '#8b5cf6', 30,
          '#a855f7', 50,
          '#d946ef', 100,
          '#ec4899',
        ],
        'circle-radius': [
          'step', ['get', 'point_count'],
          18, 10,
          22, 30,
          28, 50,
          34, 100,
          40,
        ],
        'circle-stroke-width': 3,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.15)',
        'circle-opacity': 0.9,
      },
    });

    // --- Cluster Count Labels ---
    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'incidents',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans Bold'],
        'text-size': 13,
      },
      paint: {
        'text-color': '#ffffff',
      },
    });

    // --- Unclustered Points ---
    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'incidents',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'match',
          ['get', 'severity'],
          'low', SEVERITY_COLORS.low,
          'medium', SEVERITY_COLORS.medium,
          'high', SEVERITY_COLORS.high,
          'critical', SEVERITY_COLORS.critical,
          '#6b7280',
        ],
        'circle-radius': [
          'match',
          ['get', 'severity'],
          'low', 5,
          'medium', 7,
          'high', 9,
          'critical', 11,
          6,
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': 'rgba(255, 255, 255, 0.3)',
        'circle-opacity': 0.9,
      },
    });

    // --- Critical pulse ring ---
    this.map.addLayer({
      id: 'critical-pulse',
      type: 'circle',
      source: 'incidents',
      filter: ['all',
        ['!', ['has', 'point_count']],
        ['==', ['get', 'severity'], 'critical'],
      ],
      paint: {
        'circle-color': 'transparent',
        'circle-radius': 16,
        'circle-stroke-width': 2,
        'circle-stroke-color': SEVERITY_COLORS.critical,
        'circle-stroke-opacity': 0.4,
      },
    });

    // Click handlers
    this.map.on('click', 'clusters', (e: any) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });
      if (!features.length) return;

      const clusterId = features[0].properties['cluster_id'];
      const source = this.map.getSource('incidents') as any;
      source.getClusterExpansionZoom(clusterId).then((zoom: any) => {
        const geometry = features[0].geometry;
        if (geometry.type === 'Point') {
          this.map.easeTo({
            center: geometry.coordinates as [number, number],
            zoom: zoom,
          });
        }
      });
    });

    this.map.on('click', 'unclustered-point', (e: any) => {
      const features = this.map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point'],
      });
      if (!features.length) return;

      const props = features[0].properties;
      this.selectedIncident.set({
        id: props['id'],
        title: props['title'],
        category: props['category'],
        severity: props['severity'],
        city: props['city'],
        reportedAt: props['reportedAt'],
        lat: (features[0].geometry as { type: string; coordinates: number[] }).coordinates[1],
        lng: (features[0].geometry as { type: string; coordinates: number[] }).coordinates[0],
      });
    });

    // Cursor changes
    this.map.on('mouseenter', 'clusters', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'clusters', () => {
      this.map.getCanvas().style.cursor = '';
    });
    this.map.on('mouseenter', 'unclustered-point', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'unclustered-point', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  private updateMapData(geoJson: { type: string; features: unknown[] }): void {
    if (!this.map || !this.map.isStyleLoaded()) return;

    const clusterSource = this.map.getSource('incidents') as any;
    const heatSource = this.map.getSource('incidents-heat-source') as any;

    if (clusterSource) {
      clusterSource.setData(geoJson);
    }
    if (heatSource) {
      heatSource.setData(geoJson);
    }
  }
}
