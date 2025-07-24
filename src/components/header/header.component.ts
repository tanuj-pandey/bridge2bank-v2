import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-top">
        <div class="container">
          <div class="header-top-content">
            <div class="gov-branding">
              <span class="emblem">🇮🇳</span>
              <span class="site-title">financial of India</span>
            </div>
            <div class="quick-links">
              <a href="#" class="quick-link">Hindi</a>
              <a href="#" class="quick-link">Help</a>
              <a href="#" class="quick-link">Contact</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="header-main">
        <div class="container">
          <nav class="main-nav">
            <div class="nav-brand" (click)="onLogoClick()">
              <div class="logo">
                <span class="logo-icon">🏛️</span>
                <div class="logo-text">
                  <span class="logo-title">MyScheme</span>
                  <span class="logo-subtitle">financial Schemes Portal</span>
                </div>
              </div>
            </div>
            
            <div class="nav-search">
              <div class="search-container">
                <input
                  type="text"
                  placeholder="Search for schemes, benefits, or services..."
                  class="search-input"
                  [(ngModel)]="searchQuery"
                  (input)="onSearchInput($event)"
                  (keyup.enter)="onSearch()"
                />
                <button class="search-btn" (click)="onSearch()" type="button">
                  <span class="search-icon">🔍</span>
                </button>
              </div>
            </div>
            
            <div class="nav-links">
              <a href="#" class="nav-link">All Schemes</a>
              <a href="#" class="nav-link">Categories</a>
              <a href="#" class="nav-link">Check Eligibility</a>
            </div>

            <button class="mobile-menu-btn" (click)="toggleMobileMenu()" type="button">
              <span class="hamburger">☰</span>
            </button>
          </nav>
        </div>
      </div>
      
      <div class="mobile-menu" [class.active]="isMobileMenuOpen">
        <div class="mobile-menu-content">
          <a href="#" class="mobile-nav-link">All Schemes</a>
          <a href="#" class="mobile-nav-link">Categories</a>
          <a href="#" class="mobile-nav-link">Check Eligibility</a>
          <a href="#" class="mobile-nav-link">Help</a>
          <a href="#" class="mobile-nav-link">Contact</a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: white;
      box-shadow: var(--shadow-md);
    }

    .header-top {
      background: var(--primary-900);
      color: white;
      padding: var(--space-2) 0;
    }

    .header-top-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--font-size-sm);
    }

    .gov-branding {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .emblem {
      font-size: var(--font-size-lg);
    }

    .site-title {
      font-weight: 500;
    }

    .quick-links {
      display: flex;
      gap: var(--space-4);
    }

    .quick-link {
      color: white;
      text-decoration: none;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      transition: background-color 0.2s ease;
    }

    .quick-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .header-main {
      background: white;
      padding: var(--space-4) 0;
    }

    .main-nav {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      position: relative;
    }

    .nav-brand {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .nav-brand:hover {
      transform: scale(1.02);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .logo-icon {
      font-size: var(--font-size-3xl);
      color: var(--primary-600);
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--primary-800);
      line-height: 1;
    }

    .logo-subtitle {
      font-size: var(--font-size-xs);
      color: var(--neutral-600);
      font-weight: 400;
    }

    .nav-search {
      flex: 1;
      max-width: 500px;
      margin: 0 var(--space-6);
    }

    .search-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: var(--space-3) var(--space-16) var(--space-3) var(--space-4);
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-base);
      transition: all 0.2s ease;
      background: var(--neutral-50);
    }

    .search-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
      background: white;
    }

    .search-btn {
      position: absolute;
      right: var(--space-1);
      background: var(--primary-600);
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      padding: var(--space-2) var(--space-3);
      cursor: pointer;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-btn:hover {
      background: var(--primary-700);
    }

    .search-icon {
      font-size: var(--font-size-lg);
    }

    .nav-links {
      display: flex;
      gap: var(--space-6);
    }

    .nav-link {
      color: var(--neutral-700);
      text-decoration: none;
      font-weight: 500;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .nav-link:hover {
      color: var(--primary-600);
      background: var(--primary-50);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: var(--font-size-xl);
      color: var(--neutral-700);
      cursor: pointer;
      padding: var(--space-2);
    }

    .mobile-menu {
      display: none;
      background: white;
      border-top: 1px solid var(--neutral-200);
      box-shadow: var(--shadow-lg);
    }

    .mobile-menu.active {
      display: block;
    }

    .mobile-menu-content {
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .mobile-nav-link {
      color: var(--neutral-700);
      text-decoration: none;
      padding: var(--space-3);
      border-radius: var(--radius-md);
      transition: background-color 0.2s ease;
    }

    .mobile-nav-link:hover {
      background: var(--neutral-100);
    }

    @media (max-width: 1024px) {
      .nav-links {
        display: none;
      }
      
      .mobile-menu-btn {
        display: block;
      }
      
      .nav-search {
        margin: 0 var(--space-2);
        max-width: 300px;
      }
    }

    @media (max-width: 768px) {
      .quick-links {
        gap: var(--space-2);
      }
      
      .quick-link {
        padding: var(--space-1);
        font-size: var(--font-size-xs);
      }
      
      .logo-text {
        display: none;
      }
      
      .logo-icon {
        font-size: var(--font-size-2xl);
      }
      
      .nav-search {
        margin: 0;
        max-width: 200px;
      }
      
      .search-input {
        font-size: var(--font-size-sm);
        padding: var(--space-2) var(--space-12) var(--space-2) var(--space-3);
      }
    }
  `]
})
export class HeaderComponent {
  @Output() search = new EventEmitter<string>();
  @Output() logoClick = new EventEmitter<void>();
  
  searchQuery = '';
  isMobileMenuOpen = false;

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.search.emit(this.searchQuery);
  }

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  onLogoClick(): void {
    this.logoClick.emit();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}