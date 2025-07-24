import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scheme } from '../../types/scheme.interface';

@Component({
  selector: 'app-scheme-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scheme-card" (click)="onCardClick()">
      <div class="card-header">
        <div class="scheme-category">
          <span class="category-icon">{{ scheme.category.icon }}</span>
          <span class="category-name">{{ scheme.category.name }}</span>
        </div>
        <div class="scheme-status" [class]="'status-' + scheme.status">
          {{ scheme.status | titlecase }}
        </div>
      </div>
      
      <div class="card-content">
        <h3 class="scheme-title">{{ scheme.title }}</h3>
        <p class="scheme-description">{{ scheme.description }}</p>
        
        <div class="scheme-ministry">
          <span class="ministry-label">Ministry:</span>
          <span class="ministry-name">{{ scheme.ministry }}</span>
        </div>
        
        <div class="scheme-benefits">
          <span class="benefits-label">Key Benefits:</span>
          <ul class="benefits-list">
            <li *ngFor="let benefit of scheme.benefits.slice(0, 2)">{{ benefit }}</li>
            <li *ngIf="scheme.benefits.length > 2" class="more-benefits">
              +{{ scheme.benefits.length - 2 }} more benefits
            </li>
          </ul>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="scheme-meta">
          <span class="last-updated">
            Updated: {{ scheme.lastUpdated | date:'shortDate' }}
          </span>
          <span class="featured-badge" *ngIf="scheme.featured">
            ⭐ Featured
          </span>
        </div>
        
        <button class="view-details-btn" type="button">
          <span>View Details</span>
          <span class="arrow">→</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .scheme-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--neutral-200);
      padding: var(--space-6);
      cursor: pointer;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .scheme-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-300);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
      gap: var(--space-3);
    }

    .scheme-category {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--neutral-100);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
    }

    .category-icon {
      font-size: var(--font-size-base);
    }

    .category-name {
      font-weight: 500;
      color: var(--neutral-700);
    }

    .scheme-status {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-active {
      background: var(--success-100);
      color: var(--success-800);
    }

    .status-closed {
      background: var(--neutral-200);
      color: var(--neutral-700);
    }

    .status-upcoming {
      background: var(--accent-100);
      color: var(--accent-800);
    }

    .card-content {
      flex: 1;
    }

    .scheme-title {
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
      font-weight: 600;
      line-height: var(--line-height-tight);
    }

    .scheme-description {
      color: var(--neutral-600);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-4);
    }

    .scheme-ministry {
      margin-bottom: var(--space-4);
      font-size: var(--font-size-sm);
    }

    .ministry-label {
      color: var(--neutral-500);
      font-weight: 500;
    }

    .ministry-name {
      color: var(--neutral-700);
      margin-left: var(--space-2);
    }

    .scheme-benefits {
      margin-bottom: var(--space-5);
    }

    .benefits-label {
      display: block;
      color: var(--neutral-700);
      font-weight: 500;
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-2);
    }

    .benefits-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .benefits-list li {
      color: var(--neutral-600);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      padding-left: var(--space-4);
      position: relative;
      margin-bottom: var(--space-1);
    }

    .benefits-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success-600);
      font-weight: bold;
    }

    .more-benefits {
      color: var(--primary-600) !important;
      font-weight: 500 !important;
    }

    .more-benefits::before {
      content: '+' !important;
      color: var(--primary-600) !important;
    }

    .card-footer {
      margin-top: auto;
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-100);
    }

    .scheme-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
      font-size: var(--font-size-xs);
    }

    .last-updated {
      color: var(--neutral-500);
    }

    .featured-badge {
      background: var(--accent-100);
      color: var(--accent-800);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      font-weight: 600;
    }

    .view-details-btn {
      width: 100%;
      background: var(--primary-600);
      color: white;
      border: none;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .view-details-btn:hover {
      background: var(--primary-700);
      transform: translateY(-1px);
    }

    .arrow {
      transition: transform 0.2s ease;
    }

    .scheme-card:hover .arrow {
      transform: translateX(2px);
    }

    @media (max-width: 768px) {
      .scheme-card {
        padding: var(--space-4);
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }

      .scheme-category {
        align-self: flex-start;
      }

      .scheme-title {
        font-size: var(--font-size-lg);
      }
    }
  `]
})
export class SchemeCardComponent {
  @Input() scheme!: Scheme;
  @Output() cardClick = new EventEmitter<string>();

  onCardClick(): void {
    this.cardClick.emit(this.scheme.id);
  }
}