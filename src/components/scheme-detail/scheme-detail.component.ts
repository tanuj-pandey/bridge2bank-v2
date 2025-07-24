import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scheme } from '../../types/scheme.interface';

@Component({
  selector: 'app-scheme-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scheme-detail-modal" *ngIf="scheme" (click)="onBackdropClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="scheme-header">
            <div class="scheme-category">
              <span class="category-icon">{{ scheme.category.icon }}</span>
              <span class="category-name">{{ scheme.category.name }}</span>
            </div>
            <div class="scheme-status" [class]="'status-' + scheme.status">
              {{ scheme.status | titlecase }}
            </div>
          </div>
          <button class="close-btn" (click)="onClose()" type="button">×</button>
        </div>
        
        <div class="modal-body">
          <h1 class="scheme-title">{{ scheme.title }}</h1>
          <p class="scheme-description">{{ scheme.description }}</p>
          
          <div class="scheme-ministry">
            <strong>Ministry/Department:</strong> {{ scheme.ministry }}
          </div>
          
          <div class="scheme-section">
            <h3 class="section-title">Eligibility Criteria</h3>
            <ul class="criteria-list">
              <li *ngFor="let criteria of scheme.eligibility">{{ criteria }}</li>
            </ul>
          </div>
          
          <div class="scheme-section">
            <h3 class="section-title">Benefits</h3>
            <ul class="benefits-list">
              <li *ngFor="let benefit of scheme.benefits">{{ benefit }}</li>
            </ul>
          </div>
          
          <div class="scheme-section">
            <h3 class="section-title">Application Process</h3>
            <ol class="process-list">
              <li *ngFor="let step of scheme.applicationProcess">{{ step }}</li>
            </ol>
          </div>
          
          <div class="scheme-section">
            <h3 class="section-title">Required Documents</h3>
            <ul class="documents-list">
              <li *ngFor="let document of scheme.documents">{{ document }}</li>
            </ul>
          </div>
          
          <div class="scheme-meta">
            <p class="last-updated">
              <strong>Last Updated:</strong> {{ scheme.lastUpdated | date:'fullDate' }}
            </p>
            <p class="website-link" *ngIf="scheme.website">
              <strong>Official Website:</strong> 
              <a [href]="scheme.website" target="_blank" class="external-link">
                {{ scheme.website }}
                <span class="external-icon">↗</span>
              </a>
            </p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onClose()" type="button">
            Close
          </button>
          <button class="btn btn-primary" (click)="onApply()" type="button">
            <span>Apply Now</span>
            <span class="apply-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scheme-detail-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: var(--space-4);
      animation: fadeIn 0.3s ease-in-out;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      border-radius: var(--radius-2xl);
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-xl);
      animation: slideUp 0.3s ease-out;
    }

    .modal-header {
      padding: var(--space-6) var(--space-6) 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--neutral-200);
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
    }

    .scheme-header {
      display: flex;
      align-items: center;
      gap: var(--space-4);
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

    .close-btn {
      background: none;
      border: none;
      font-size: var(--font-size-3xl);
      color: var(--neutral-500);
      cursor: pointer;
      padding: var(--space-1);
      line-height: 1;
      transition: color 0.2s ease;
    }

    .close-btn:hover {
      color: var(--neutral-700);
    }

    .modal-body {
      padding: 0 var(--space-6) var(--space-6);
    }

    .scheme-title {
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }

    .scheme-description {
      color: var(--neutral-600);
      font-size: var(--font-size-lg);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-6);
    }

    .scheme-ministry {
      background: var(--neutral-50);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
      font-size: var(--font-size-sm);
      color: var(--neutral-700);
    }

    .scheme-section {
      margin-bottom: var(--space-8);
    }

    .section-title {
      color: var(--neutral-900);
      margin-bottom: var(--space-4);
      font-weight: 600;
      font-size: var(--font-size-lg);
    }

    .criteria-list,
    .benefits-list,
    .documents-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .criteria-list li,
    .benefits-list li,
    .documents-list li {
      color: var(--neutral-600);
      padding: var(--space-2) 0 var(--space-2) var(--space-6);
      position: relative;
      line-height: var(--line-height-relaxed);
      border-bottom: 1px solid var(--neutral-100);
    }

    .criteria-list li:last-child,
    .benefits-list li:last-child,
    .documents-list li:last-child {
      border-bottom: none;
    }

    .criteria-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success-600);
      font-weight: bold;
    }

    .benefits-list li::before {
      content: '💰';
      position: absolute;
      left: 0;
    }

    .documents-list li::before {
      content: '📄';
      position: absolute;
      left: 0;
    }

    .process-list {
      counter-reset: step-counter;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .process-list li {
      counter-increment: step-counter;
      color: var(--neutral-600);
      padding: var(--space-3) 0 var(--space-3) var(--space-8);
      position: relative;
      line-height: var(--line-height-relaxed);
      border-bottom: 1px solid var(--neutral-100);
    }

    .process-list li:last-child {
      border-bottom: none;
    }

    .process-list li::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      top: var(--space-3);
      background: var(--primary-600);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    .scheme-meta {
      background: var(--neutral-50);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      margin-top: var(--space-6);
    }

    .last-updated,
    .website-link {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--neutral-600);
    }

    .website-link {
      margin-top: var(--space-2);
    }

    .external-link {
      color: var(--primary-600);
      text-decoration: none;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      margin-left: var(--space-2);
    }

    .external-link:hover {
      text-decoration: underline;
    }

    .external-icon {
      font-size: var(--font-size-sm);
    }

    .modal-footer {
      padding: var(--space-6);
      border-top: 1px solid var(--neutral-200);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
    }

    .apply-icon {
      transition: transform 0.2s ease;
    }

    .btn-primary:hover .apply-icon {
      transform: translateX(2px);
    }

    @media (max-width: 768px) {
      .scheme-detail-modal {
        padding: var(--space-2);
        align-items: flex-start;
        padding-top: var(--space-8);
      }

      .modal-content {
        max-height: calc(100vh - var(--space-16));
        border-radius: var(--radius-xl);
      }

      .modal-header {
        padding: var(--space-4) var(--space-4) 0;
        margin-bottom: var(--space-4);
        padding-bottom: var(--space-3);
      }

      .scheme-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }

      .modal-body {
        padding: 0 var(--space-4) var(--space-4);
      }

      .scheme-title {
        font-size: var(--font-size-xl);
      }

      .modal-footer {
        padding: var(--space-4);
        flex-direction: column;
      }
    }
  `]
})
export class SchemeDetailComponent {
  @Input() scheme: Scheme | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<string>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onApply(): void {
    if (this.scheme) {
      this.apply.emit(this.scheme.id);
    }
  }
}