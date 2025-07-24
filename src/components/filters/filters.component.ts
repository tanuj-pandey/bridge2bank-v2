import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchemeCategory, SearchFilters } from '../../types/scheme.interface';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="container">
        <div class="filters-header">
          <h3 class="filters-title">Filter Schemes</h3>
          <button 
            class="clear-filters-btn" 
            (click)="onClearFilters()"
            [disabled]="!hasActiveFilters()"
            type="button"
          >
            Clear All
          </button>
        </div>
        
        <div class="filters-content">
          <div class="filter-group">
            <label for="category-filter" class="filter-label">Category</label>
            <select 
              id="category-filter"
              class="form-select"
              [(ngModel)]="filters.category"
              (ngModelChange)="onFilterChange()"
            >
              <option value="">All Categories</option>
              <option 
                *ngFor="let category of categories" 
                [value]="category.id"
              >
                {{ category.icon }} {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="state-filter" class="filter-label">State/UT</label>
            <select 
              id="state-filter"
              class="form-select"
              [(ngModel)]="filters.state"
              (ngModelChange)="onFilterChange()"
            >
              <option value="">All States/UTs</option>
              <option *ngFor="let state of states" [value]="state">
                {{ state }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="beneficiary-filter" class="filter-label">Beneficiary Type</label>
            <select 
              id="beneficiary-filter"
              class="form-select"
              [(ngModel)]="filters.beneficiary"
              (ngModelChange)="onFilterChange()"
            >
              <option value="">All Beneficiaries</option>
              <option *ngFor="let type of beneficiaryTypes" [value]="type">
                {{ type }}
              </option>
            </select>
          </div>
          
          <div class="filter-group search-group">
            <label for="search-filter" class="filter-label">Search</label>
            <input 
              id="search-filter"
              type="text"
              class="form-input"
              placeholder="Search schemes..."
              [(ngModel)]="filters.query"
              (ngModelChange)="onFilterChange()"
            />
          </div>
        </div>
        
        <div class="active-filters" *ngIf="hasActiveFilters()">
          <span class="active-filters-label">Active filters:</span>
          <div class="filter-tags">
            <span 
              class="filter-tag"
              *ngIf="filters.category"
              (click)="removeFilter('category')"
            >
              {{ getCategoryName(filters.category) }}
              <span class="remove-tag">×</span>
            </span>
            <span 
              class="filter-tag"
              *ngIf="filters.state"
              (click)="removeFilter('state')"
            >
              {{ filters.state }}
              <span class="remove-tag">×</span>
            </span>
            <span 
              class="filter-tag"
              *ngIf="filters.beneficiary"
              (click)="removeFilter('beneficiary')"
            >
              {{ filters.beneficiary }}
              <span class="remove-tag">×</span>
            </span>
            <span 
              class="filter-tag"
              *ngIf="filters.query"
              (click)="removeFilter('query')"
            >
              "{{ filters.query }}"
              <span class="remove-tag">×</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      border-bottom: 1px solid var(--neutral-200);
      padding: var(--space-6) 0;
      position: sticky;
      top: 140px;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
    }

    .filters-title {
      color: var(--neutral-900);
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin: 0;
    }

    .clear-filters-btn {
      background: none;
      border: 1px solid var(--neutral-300);
      color: var(--neutral-600);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: var(--font-size-sm);
    }

    .clear-filters-btn:hover:not(:disabled) {
      background: var(--neutral-100);
      border-color: var(--neutral-400);
    }

    .clear-filters-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .filters-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .search-group {
      grid-column: span 2;
    }

    .filter-label {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
    }

    .active-filters {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-wrap: wrap;
      padding-top: var(--space-4);
      border-top: 1px solid var(--neutral-200);
    }

    .active-filters-label {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: var(--neutral-600);
      white-space: nowrap;
    }

    .filter-tags {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .filter-tag {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      background: var(--primary-100);
      color: var(--primary-800);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-tag:hover {
      background: var(--primary-200);
    }

    .remove-tag {
      font-weight: bold;
      font-size: var(--font-size-lg);
      line-height: 1;
    }

    @media (max-width: 1024px) {
      .search-group {
        grid-column: span 1;
      }
    }

    @media (max-width: 768px) {
      .filters-container {
        position: relative;
        top: auto;
      }

      .filters-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .filters-content {
        grid-template-columns: 1fr;
        gap: var(--space-3);
      }

      .search-group {
        grid-column: span 1;
      }

      .active-filters {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2);
      }
    }
  `]
})
export class FiltersComponent {
  @Input() categories: SchemeCategory[] = [];
  @Input() states: string[] = [];
  @Input() beneficiaryTypes: string[] = [];
  @Output() filtersChange = new EventEmitter<SearchFilters>();
  @Output() clearFilters = new EventEmitter<void>();
  
  filters: SearchFilters = {
    category: '',
    state: '',
    beneficiary: '',
    query: ''
  };

  onFilterChange(): void {
    const activeFilters: SearchFilters = {};
    
    if (this.filters.category) activeFilters.category = this.filters.category;
    if (this.filters.state) activeFilters.state = this.filters.state;
    if (this.filters.beneficiary) activeFilters.beneficiary = this.filters.beneficiary;
    if (this.filters.query) activeFilters.query = this.filters.query;
    
    this.filtersChange.emit(activeFilters);
  }

  onClearFilters(): void {
    this.filters = {
      category: '',
      state: '',
      beneficiary: '',
      query: ''
    };
    this.clearFilters.emit();
  }

  removeFilter(filterType: keyof SearchFilters): void {
    this.filters[filterType] = '';
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.category || this.filters.state || 
              this.filters.beneficiary || this.filters.query);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? `${category.icon} ${category.name}` : categoryId;
  }
}