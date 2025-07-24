import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeCategory } from '../../types/scheme.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Browse by Category</h2>
          <p class="section-description">
            Explore government schemes organized by different categories to find what you need
          </p>
        </div>
        
        <div class="categories-grid">
          <div 
            class="category-card"
            *ngFor="let category of categories; trackBy: trackByCategory"
            (click)="onCategoryClick(category.id)"
          >
            <div class="category-icon" [style.color]="category.color">
              {{ category.icon }}
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-description">{{ category.description }}</p>
            <div class="category-arrow">→</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .categories-section {
      padding: var(--space-20) 0;
      background: white;
    }

    .section-header {
      text-align: center;
      margin-bottom: var(--space-16);
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

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
    }

    .category-card {
      background: white;
      border: 1px solid var(--neutral-200);
      border-radius: var(--radius-xl);
      padding: var(--space-8);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .category-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(59, 130, 246, 0.05),
        transparent
      );
      transition: left 0.5s ease;
    }

    .category-card:hover::before {
      left: 100%;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-200);
    }

    .category-icon {
      font-size: var(--font-size-5xl);
      margin-bottom: var(--space-4);
      display: block;
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-icon {
      transform: scale(1.1);
    }

    .category-name {
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
      font-weight: 600;
    }

    .category-description {
      color: var(--neutral-600);
      font-size: var(--font-size-sm);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-4);
    }

    .category-arrow {
      color: var(--primary-600);
      font-weight: bold;
      font-size: var(--font-size-xl);
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-arrow {
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .categories-section {
        padding: var(--space-16) 0;
      }

      .categories-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }

      .category-card {
        padding: var(--space-6);
      }

      .category-icon {
        font-size: var(--font-size-4xl);
      }
    }
  `]
})
export class CategoriesComponent {
  @Input() categories: SchemeCategory[] = [];
  @Output() categorySelect = new EventEmitter<string>();

  onCategoryClick(categoryId: string): void {
    this.categorySelect.emit(categoryId);
  }

  trackByCategory(index: number, category: SchemeCategory): string {
    return category.id;
  }
}