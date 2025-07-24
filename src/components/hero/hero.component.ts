import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="hero">
      <div class="hero-background">
        <div class="hero-pattern"></div>
      </div>
      
      <div class="container">
        <div class="hero-content fade-in">
          <div class="hero-text">
            <h1 class="hero-title">
              Discover financial Schemes
              <span class="highlight">Designed for You</span>
            </h1>
            <p class="hero-description">
              Find and apply for financial schemes, subsidies, and benefits. 
              Get personalized recommendations based on your eligibility and needs.
            </p>
          </div>
          
          <div class="hero-search">
            <div class="search-box">
              <input
                type="text"
                placeholder="Search for schemes by name, category, or benefits..."
                class="hero-search-input"
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
              />
              <button class="hero-search-btn" (click)="onSearch()" type="button">
                <span>Search Schemes</span>
                <span class="search-arrow">→</span>
              </button>
            </div>
            
            <div class="quick-actions">
              <button 
                class="quick-action-btn"
                *ngFor="let action of quickActions"
                (click)="onQuickAction(action.id)"
                type="button"
              >
                <span class="action-icon">{{ action.icon }}</span>
                <span class="action-text">{{ action.label }}</span>
              </button>
            </div>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">500+</span>
              <span class="stat-label">Active Schemes</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">50M+</span>
              <span class="stat-label">Beneficiaries</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">28</span>
              <span class="stat-label">States & UTs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
      color: white;
      padding: var(--space-20) 0 var(--space-16);
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.1;
    }

    .hero-pattern {
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
      background-size: 60px 60px;
      background-position: 0 0, 30px 30px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: var(--font-size-5xl);
      font-weight: 700;
      line-height: var(--line-height-tight);
      margin-bottom: var(--space-6);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .highlight {
      display: block;
      background: linear-gradient(45deg, var(--accent-400), var(--accent-600));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-top: var(--space-2);
    }

    .hero-description {
      font-size: var(--font-size-lg);
      line-height: var(--line-height-relaxed);
      margin-bottom: var(--space-10);
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: var(--space-10);
    }

    .hero-search {
      margin-bottom: var(--space-12);
    }

    .search-box {
      display: flex;
      max-width: 600px;
      margin: 0 auto var(--space-6);
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--space-2);
      box-shadow: var(--shadow-xl);
    }

    .hero-search-input {
      flex: 1;
      border: none;
      padding: var(--space-4) var(--space-5);
      font-size: var(--font-size-base);
      color: var(--neutral-900);
      background: transparent;
      border-radius: var(--radius-xl);
    }

    .hero-search-input:focus {
      outline: none;
    }

    .hero-search-input::placeholder {
      color: var(--neutral-500);
    }

    .hero-search-btn {
      background: var(--accent-500);
      color: white;
      border: none;
      padding: var(--space-4) var(--space-6);
      border-radius: var(--radius-xl);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      white-space: nowrap;
    }

    .hero-search-btn:hover {
      background: var(--accent-600);
      transform: translateY(-1px);
      box-shadow: var(--shadow-lg);
    }

    .search-arrow {
      transition: transform 0.2s ease;
    }

    .hero-search-btn:hover .search-arrow {
      transform: translateX(2px);
    }

    .quick-actions {
      display: flex;
      justify-content: center;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .quick-action-btn {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: var(--space-3) var(--space-5);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      backdrop-filter: blur(10px);
    }

    .quick-action-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: var(--font-size-lg);
    }

    .action-text {
      font-size: var(--font-size-sm);
      font-weight: 500;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: var(--space-12);
      margin-top: var(--space-8);
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: var(--font-size-3xl);
      font-weight: 700;
      line-height: 1;
      margin-bottom: var(--space-1);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media (max-width: 768px) {
      .hero {
        padding: var(--space-16) 0 var(--space-12);
      }

      .hero-title {
        font-size: var(--font-size-3xl);
      }

      .hero-description {
        font-size: var(--font-size-base);
        margin-bottom: var(--space-8);
      }

      .search-box {
        flex-direction: column;
        gap: var(--space-2);
      }

      .hero-search-input {
        padding: var(--space-3) var(--space-4);
      }

      .hero-search-btn {
        justify-content: center;
        padding: var(--space-3) var(--space-4);
      }

      .quick-actions {
        gap: var(--space-2);
      }

      .quick-action-btn {
        padding: var(--space-2) var(--space-3);
        font-size: var(--font-size-xs);
      }

      .hero-stats {
        gap: var(--space-6);
        flex-wrap: wrap;
      }

      .stat-number {
        font-size: var(--font-size-2xl);
      }
    }
  `]
})
export class HeroComponent {
  @Output() search = new EventEmitter<string>();
  @Output() quickAction = new EventEmitter<string>();
  
  searchQuery = '';
  
  quickActions = [
    { id: 'check-eligibility', label: 'Check Eligibility', icon: '✓' },
    { id: 'popular-schemes', label: 'Popular Schemes', icon: '⭐' },
    { id: 'new-schemes', label: 'New Schemes', icon: '🆕' },
    { id: 'apply-now', label: 'Apply Now', icon: '📝' }
  ];

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit(this.searchQuery);
    }
  }

  onQuickAction(actionId: string): void {
    this.quickAction.emit(actionId);
  }
}