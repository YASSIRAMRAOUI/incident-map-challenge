import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `
    <div class="error-overlay" id="error-state">
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{{ message() }}</p>
        <button class="retry-btn" (click)="retry.emit()" id="error-retry-btn">
          Try again
        </button>
      </div>
    </div>
  `,
  styles: [`
    .error-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.95);
      z-index: 50;
      animation: fadeIn 0.3s ease;
    }

    .error-content {
      text-align: center;
      max-width: 360px;
      padding: 2rem;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.15rem;
      font-weight: 600;
      color: #fca5a5;
      margin: 0 0 0.5rem;
    }

    p {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0 0 1.25rem;
      line-height: 1.5;
    }

    .retry-btn {
      padding: 0.5rem 1.25rem;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #f87171;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.25);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
})
export class ErrorStateComponent {
  readonly message = input('Failed to load incident data. Please try again.');
  readonly retry = output<void>();
}
