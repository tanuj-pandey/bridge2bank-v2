import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { WebchatComponent } from './components/webchat/webchat.component';
import { SchemeFinderComponent } from './components/scheme-finder/scheme-finder.component';

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: string;
  ministry: string;
  benefits: string[];
  eligibility: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, SchemeFinderComponent, WebchatComponent],
  template: `
    <div class="app">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="logo">
              <span class="logo-icon">🏛️</span>
              <span class="logo-text">MyScheme</span>
            </div>
            <div class="search-box">
              <input
                type="text"
                placeholder="Search schemes..."
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                class="search-input"
              />
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1 class="hero-title">Discover Government Schemes</h1>
          <p class="hero-subtitle">Find and apply for government schemes designed for you</p>
          
          <!-- Find Schemes Button -->
          <div class="hero-actions">
            <button class="btn btn-primary btn-large" (click)="openSchemeFinder()" type="button">
              <span class="btn-icon">🎯</span>
              <span>Find Schemes for You</span>
              <span class="btn-arrow">→</span>
            </button>
            <p class="hero-action-subtitle">
              Answer a few questions to get personalized scheme recommendations
            </p>
          </div>
        </div>
      </section>

      <!-- Schemes List -->
      <section class="schemes-section">
        <div class="container">
          <h2 class="section-title">Available Schemes</h2>
          <div class="schemes-grid">
            <div 
              *ngFor="let scheme of filteredSchemes()" 
              class="scheme-card"
              (click)="selectScheme(scheme)"
            >
              <div class="scheme-category">{{ scheme.category }}</div>
              <h3 class="scheme-title">{{ scheme.title }}</h3>
              <p class="scheme-description">{{ scheme.description }}</p>
              <div class="scheme-ministry">{{ scheme.ministry }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Scheme Detail Modal -->
      <div *ngIf="selectedScheme()" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ selectedScheme()?.title }}</h2>
            <button class="close-btn" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <p><strong>Category:</strong> {{ selectedScheme()?.category }}</p>
            <p><strong>Ministry:</strong> {{ selectedScheme()?.ministry }}</p>
            <p class="description">{{ selectedScheme()?.description }}</p>
            
            <h3>Benefits</h3>
            <ul>
              <li *ngFor="let benefit of selectedScheme()?.benefits">{{ benefit }}</li>
            </ul>
            
            <h3>Eligibility</h3>
            <ul>
              <li *ngFor="let criteria of selectedScheme()?.eligibility">{{ criteria }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Scheme Finder Modal -->
    <app-scheme-finder *ngIf="showSchemeFinder()"></app-scheme-finder>
    
    <!-- Custom Webchat -->
    <app-webchat></app-webchat>
  `,
  styles: [
    `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Header */
    .header {
      background: #1e3a8a;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .search-box {
      flex: 1;
      max-width: 400px;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: 2px solid #f97316;
    }

    /* Hero */
    .hero {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: white;
      padding: 4rem 0 5rem;
      text-align: center;
    }

    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
    }

    .hero-actions {
      margin-top: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #f97316;
      color: white;
    }

    .btn-primary:hover {
      background: #ea580c;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
    }

    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.125rem;
      border-radius: 0.75rem;
    }

    .btn-icon {
      font-size: 1.25rem;
    }

    .btn-arrow {
      transition: transform 0.2s ease;
    }

    .btn-primary:hover .btn-arrow {
      transform: translateX(4px);
    }

    .hero-action-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      margin: 0;
      max-width: 400px;
    }

    /* Schemes Section */
    .schemes-section {
      padding: 4rem 0;
      background: #f8fafc;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 2rem;
      text-align: center;
      color: #1e293b;
    }

    .schemes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .scheme-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
    }

    .scheme-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border-color: #3b82f6;
    }

    .scheme-category {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .scheme-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: #1e293b;
    }

    .scheme-description {
      color: #64748b;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .scheme-ministry {
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      color: #1e293b;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #64748b;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }

    .close-btn:hover {
      color: #1e293b;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-body p {
      margin-bottom: 1rem;
    }

    .description {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #475569;
    }

    .modal-body h3 {
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 1.5rem 0 0.75rem 0;
    }

    .modal-body ul {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .modal-body li {
      margin-bottom: 0.5rem;
      color: #475569;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }

      .search-box {
        max-width: 100%;
      }

      .hero-title {
        font-size: 2rem;
      }
      
      .hero-actions {
        margin-top: 2rem;
      }
      
      .btn-large {
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
      }

      .schemes-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .modal-overlay {
        padding: 1rem;
      }
    }
  `,
  ],
})
export class App {
  searchQuery = signal('');
  selectedScheme = signal<Scheme | null>(null);
  showSchemeFinder = signal(false);

  schemes: Scheme[] = [
    {
      id: '1',
      title: 'PM-KISAN',
      description:
        'Income support scheme providing ₹6,000 per year to eligible farmer families',
      category: 'Agriculture',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      benefits: [
        '₹6,000 per year in three equal installments',
        'Direct transfer to bank account',
        'Financial support for agricultural activities',
      ],
      eligibility: [
        'Small and marginal farmer families',
        'Family owning cultivable land up to 2 hectares',
        'Names in land records',
        'Valid Aadhaar card',
      ],
    },
    {
      id: '2',
      title: 'Ayushman Bharat',
      description:
        'Health insurance scheme providing coverage up to ₹5 lakh per family per year',
      category: 'Health',
      ministry: 'Ministry of Health & Family Welfare',
      benefits: [
        'Health coverage up to ₹5 lakh per family per year',
        'Cashless treatment at empaneled hospitals',
        'Coverage for pre and post-hospitalization',
        'No restriction on family size and age',
      ],
      eligibility: [
        'Families identified in SECC-2011',
        'Rural and urban poor families',
        'Occupational category workers',
        'Vulnerable tribal groups',
      ],
    },
    {
      id: '3',
      title: 'Beti Bachao Beti Padhao',
      description:
        "Scheme to address declining child sex ratio and promote girls' education",
      category: 'Women & Child',
      ministry: 'Ministry of Women & Child Development',
      benefits: [
        'Educational scholarships',
        'Skill development programs',
        'Awareness campaigns',
        'Protection from discrimination',
      ],
      eligibility: [
        'Girl children',
        'Focus on districts with adverse child sex ratio',
        'All economic backgrounds',
        'Age group 0-18 years',
      ],
    },
    {
      id: '4',
      title: 'Skill India',
      description: 'Skill development and training program for Indian youth',
      category: 'Employment',
      ministry: 'Ministry of Skill Development & Entrepreneurship',
      benefits: [
        'Free skill training programs',
        'Monetary reward upon completion',
        'Job placement assistance',
        'Recognition of Prior Learning (RPL)',
      ],
      eligibility: [
        'Indian citizens aged 18-35 years',
        'School dropouts and unemployed youth',
        'Minimum 10th class pass',
        'Should not have formal skills training',
      ],
    },
    {
      id: '5',
      title: 'National Scholarship Portal',
      description: 'Centralized platform for various scholarship schemes',
      category: 'Education',
      ministry: 'Ministry of Electronics & Information Technology',
      benefits: [
        'Financial assistance for education',
        'Multiple scholarship options',
        'Direct benefit transfer',
        'Reduced paperwork',
      ],
      eligibility: [
        'Students from various educational levels',
        'Merit-based and need-based criteria',
        'Specific eligibility for each scholarship',
        'Valid student enrollment',
      ],
    },
  ];

  filteredSchemes = signal<Scheme[]>(this.schemes);

  onSearch(): void {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      this.filteredSchemes.set(this.schemes);
      return;
    }

    const filtered = this.schemes.filter(
      (scheme) =>
        scheme.title.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query) ||
        scheme.category.toLowerCase().includes(query)
    );
    this.filteredSchemes.set(filtered);
  }

  selectScheme(scheme: Scheme): void {
    this.selectedScheme.set(scheme);
  }

  closeModal(): void {
    this.selectedScheme.set(null);
  }

  openSchemeFinder(): void {
    this.showSchemeFinder.set(true);
  }

  constructor() {
    // Listen for scheme finder close event
    window.addEventListener('scheme-finder-close', () => {
      this.showSchemeFinder.set(false);
    });
  }
}

bootstrapApplication(App);
