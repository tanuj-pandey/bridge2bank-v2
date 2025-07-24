import { Injectable, signal } from '@angular/core';
import { Scheme, SearchFilters } from '../types/scheme.interface';
import { schemes, categories, states, beneficiaryTypes } from '../data/schemes.data';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {
  private allSchemes = signal<Scheme[]>(schemes);
  private filteredSchemes = signal<Scheme[]>(schemes);
  private isLoading = signal<boolean>(false);

  getAllSchemes() {
    return this.allSchemes.asReadonly();
  }

  getFilteredSchemes() {
    return this.filteredSchemes.asReadonly();
  }

  getCategories() {
    return categories;
  }

  getStates() {
    return states;
  }

  getBeneficiaryTypes() {
    return beneficiaryTypes;
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  getSchemeById(id: string): Scheme | undefined {
    return this.allSchemes().find(scheme => scheme.id === id);
  }

  getFeaturedSchemes(): Scheme[] {
    return this.allSchemes().filter(scheme => scheme.featured);
  }

  getSchemesByCategory(categoryId: string): Scheme[] {
    return this.allSchemes().filter(scheme => scheme.category.id === categoryId);
  }

  searchSchemes(query: string): void {
    this.isLoading.set(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (!query.trim()) {
        this.filteredSchemes.set(this.allSchemes());
      } else {
        const filtered = this.allSchemes().filter(scheme =>
          scheme.title.toLowerCase().includes(query.toLowerCase()) ||
          scheme.description.toLowerCase().includes(query.toLowerCase()) ||
          scheme.category.name.toLowerCase().includes(query.toLowerCase()) ||
          scheme.ministry.toLowerCase().includes(query.toLowerCase())
        );
        this.filteredSchemes.set(filtered);
      }
      this.isLoading.set(false);
    }, 300);
  }

  filterSchemes(filters: SearchFilters): void {
    this.isLoading.set(true);
    
    setTimeout(() => {
      let filtered = [...this.allSchemes()];

      if (filters.query) {
        filtered = filtered.filter(scheme =>
          scheme.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
          scheme.description.toLowerCase().includes(filters.query!.toLowerCase()) ||
          scheme.category.name.toLowerCase().includes(filters.query!.toLowerCase())
        );
      }

      if (filters.category) {
        filtered = filtered.filter(scheme => scheme.category.id === filters.category);
      }

      if (filters.beneficiary) {
        filtered = filtered.filter(scheme =>
          scheme.eligibility.some(criteria =>
            criteria.toLowerCase().includes(filters.beneficiary!.toLowerCase())
          )
        );
      }

      this.filteredSchemes.set(filtered);
      this.isLoading.set(false);
    }, 300);
  }

  resetFilters(): void {
    this.filteredSchemes.set(this.allSchemes());
  }
}