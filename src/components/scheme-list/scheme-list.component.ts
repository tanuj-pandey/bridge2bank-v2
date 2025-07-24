import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeCardComponent } from '../scheme-card/scheme-card.component';
import { Scheme } from '../../types/scheme.interface';

@Component({
  selector: 'app-scheme-list',
  standalone: true,
  imports: [CommonModule, SchemeCardComponent],
  template: `
    <section class="scheme-list-section">
      <div class="container">
        <div class="section-header" *ngIf="title">
          <h2 class="section-title">{{ title }}</h2>
          <p class="section-description" *ngIf="description">{{ description }}</p>
        </div>
        
        <div class="loading-state" *ngIf="isLoading">
          <div class="loading-spinner"></div>
          <p>Loading schemes...</p>
        </div>
        
        <div class="schemes-grid" *ngIf="!isLoading && schemes.length > 0">
          <app-scheme-card
            *ngFor="let scheme of schemes; trackBy: trackByScheme"
            [scheme]="scheme"
            (cardClick)="onSchemeClick($event)"
            class="slide-up"
          ></app-scheme-card>
        </div>
        
        <div class="empty-state" *ngIf="!isLoading && schemes.length === 0">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No schemes found</h3>
          <p class="empty-description">
            Try adjusting your search criteria or browse through different categories
          </p>
          <button class="btn btn-primary" (click)="onViewAllClick()" type="button">
            View All Schemes
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .scheme-list-section {
      padding: var(--space-16) 0;
      background: var(--neutral-50);
    }

    .section-header {
      text-align: center;
      margin-bottom: var(--space-12);
    }

    .section-title {
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
    }

    .section-description {
      color: var(--neutral-600);
      font-size: var(--font-size-lg);
      max-width: 600px;
      margin: 0 auto;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-20) var(--space-4);
      text-align: center;
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--neutral-200);
      border-top: 4px solid var(--primary-600);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--space-4);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .schemes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--space-6);
      animation: fadeIn 0.6s ease-in-out;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-20) var(--space-4);
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--neutral-200);
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: var(--font-size-5xl);
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }

    .empty-title {
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
    }

    .empty-description {
      color: var(--neutral-600);
      margin-bottom: var(--space-6);
      line-height: var(--line-height-relaxed);
    }

    @media (max-width: 768px) {
      .scheme-list-section {
        padding: var(--space-12) 0;
      }

      .schemes-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }

      .section-header {
        margin-bottom: var(--space-8);
      }

      .loading-state,
      .empty-state {
        padding: var(--space-12) var(--space-4);
      }
    }
  `]
})
export class SchemeListComponent {
  @Input() schemes: Scheme[] = [];
  @Input() title?: string;
  @Input() description?: string;
  @Input() isLoading = false;
  @Output() schemeClick = new EventEmitter<string>();
  @Output() viewAllClick = new EventEmitter<void>();

  onSchemeClick(schemeId: string): void {
    this.schemeClick.emit(schemeId);
  }

  onViewAllClick(): void {
    this.viewAllClick.emit();
  }

  trackByScheme(index: number, scheme: Scheme): string {
    return scheme.id;
  }
}