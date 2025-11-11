import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  template: `
    <div class="placeholder-container">
      <mat-card class="placeholder-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>construction</mat-icon>
            {{ title }}
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ description }}</p>
          <p class="note">This module is currently under development and will be available soon.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .placeholder-container {
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
    .placeholder-card {
      max-width: 500px;
      text-align: center;
    }
    .mat-mdc-card-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .note {
      color: #666;
      font-style: italic;
      margin-top: 16px;
    }
  `]
})
export class PlaceholderComponent {
  title = 'Module Coming Soon';
  description = 'This feature is currently under development.';
}