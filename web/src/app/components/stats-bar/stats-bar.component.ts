import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from '../../services/incident.service';
import { SEVERITY_COLORS } from '../../models/incident.model';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-bar.component.html',
  styleUrl: './stats-bar.component.scss',
})
export class StatsBarComponent {
  readonly incidentService = inject(IncidentService);
  readonly isHeatmapMode = input(false);
  readonly viewModeToggle = output<void>();

  readonly severityColors = SEVERITY_COLORS;

  onToggleView(): void {
    this.viewModeToggle.emit();
  }

  onAcknowledge(): void {
    this.incidentService.acknowledgeNewIncidents();
  }
}
