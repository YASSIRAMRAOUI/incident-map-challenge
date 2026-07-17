import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="loading-overlay" id="loading-state">
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="loading-text">
          <h3>Loading incidents</h3>
          <p>Connecting to operations feed...</p>
        </div>
        <div class="skeleton-bars">
          <div class="skeleton-bar"></div>
          <div class="skeleton-bar short"></div>
          <div class="skeleton-bar medium"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.95);
      z-index: 50;
      animation: fadeIn 0.3s ease;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      text-align: center;
    }

    .loading-text h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 0.35rem;
    }

    .loading-text p {
      font-size: 0.8rem;
      color: #64748b;
      margin: 0;
    }

    .skeleton-bars {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 200px;
    }

    .skeleton-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 4px;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    .skeleton-bar.short { width: 60%; }
    .skeleton-bar.medium { width: 80%; }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes shimmer {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.8; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
})
export class LoadingSkeletonComponent {}
