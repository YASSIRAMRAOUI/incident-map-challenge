import { Component, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-overlay" id="empty-state">
      <div class="empty-content">
        <div class="empty-icon">🔍</div>
        <h3>No incidents found</h3>
        <p>No incidents match your current filters. Try adjusting your filter criteria.</p>
        <button class="reset-btn" (click)="resetFilters.emit()" id="empty-reset-btn">
          Reset filters
        </button>
      </div>
    </div>
  `,
  styles: [`
    .empty-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      z-index: 30;
      animation: fadeIn 0.3s ease;
    }

    .empty-content {
      text-align: center;
      max-width: 320px;
      padding: 2rem;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.15rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 0.5rem;
    }

    p {
      font-size: 0.8rem;
      color: #64748b;
      margin: 0 0 1.25rem;
      line-height: 1.5;
    }

    .reset-btn {
      padding: 0.5rem 1.25rem;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 8px;
      color: #a5b4fc;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(99, 102, 241, 0.25);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
})
export class EmptyStateComponent {
  readonly resetFilters = output<void>();
}
