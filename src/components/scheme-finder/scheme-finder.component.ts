import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormWizardService } from '../../services/form-wizard.service';
import { FormData, FormField } from '../../types/form-wizard.interface';
import { SchemeCardComponent } from '../scheme-card/scheme-card.component';

@Component({
  selector: 'app-scheme-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, SchemeCardComponent],
  template: `
    <div class="scheme-finder-overlay" (click)="onBackdropClick($event)">
      <div class="scheme-finder-container" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="finder-header">
          <h2 class="finder-title">Help us find the best schemes for you</h2>
          <button class="close-btn" (click)="onClose()" type="button">×</button>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [style.width.%]="wizardService.getProgressPercentage()"
            ></div>
          </div>
          <div class="step-indicators">
            <div 
              *ngFor="let step of wizardService.getSteps(); let i = index"
              class="step-indicator"
              [class.completed]="i < wizardService.getCurrentStep()()"
              [class.active]="i === wizardService.getCurrentStep()()"
              (click)="goToStep(i)"
            >
              <span *ngIf="i < wizardService.getCurrentStep()()" class="step-check">✓</span>
              <span *ngIf="i >= wizardService.getCurrentStep()()" class="step-number">{{ i + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="finder-content" *ngIf="!showResults">
          <div class="step-content">
            <h3 class="step-title">{{ currentStepData.title }}</h3>
            <p class="step-description" *ngIf="currentStepData.description">
              {{ currentStepData.description }}
            </p>

            <form class="step-form" (ngSubmit)="onNext()">
              <div 
                *ngFor="let field of getVisibleFields()" 
                class="form-group"
                [class.form-group-inline]="field.type === 'radio' && field.options && field.options.length <= 3"
              >
                <label class="field-label" [for]="field.id">
                  <span *ngIf="field.required" class="required-asterisk">*</span>
                  {{ field.label }}
                  <span *ngIf="field.helpText" class="help-icon" [title]="field.helpText">ℹ️</span>
                </label>

                <!-- Text Input -->
                <input
                  *ngIf="field.type === 'text'"
                  type="text"
                  [id]="field.id"
                  [placeholder]="field.placeholder || ''"
                  [(ngModel)]="stepFormData[field.id]"
                  [name]="field.id"
                  class="form-input"
                />

                <!-- Number Input -->
                <input
                  *ngIf="field.type === 'number'"
                  type="number"
                  [id]="field.id"
                  [placeholder]="field.placeholder || ''"
                  [(ngModel)]="stepFormData[field.id]"
                  [name]="field.id"
                  class="form-input"
                />

                <!-- Select Dropdown -->
                <select
                  *ngIf="field.type === 'select'"
                  [id]="field.id"
                  [(ngModel)]="stepFormData[field.id]"
                  [name]="field.id"
                  class="form-select"
                >
                  <option value="">--Select One--</option>
                  <option 
                    *ngFor="let option of field.options" 
                    [value]="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>

                <!-- Radio Buttons -->
                <div *ngIf="field.type === 'radio'" class="radio-group">
                  <label 
                    *ngFor="let option of field.options" 
                    class="radio-option"
                    [class.selected]="stepFormData[field.id] === option.value"
                  >
                    <input
                      type="radio"
                      [name]="field.id"
                      [value]="option.value"
                      [(ngModel)]="stepFormData[field.id]"
                      class="radio-input"
                    />
                    <div class="radio-content">
                      <span class="radio-label">{{ option.label }}</span>
                      <span *ngIf="option.description" class="radio-description">
                        {{ option.description }}
                      </span>
                    </div>
                    <span *ngIf="option.description" class="info-icon">ℹ️</span>
                  </label>
                </div>

                <!-- Checkbox -->
                <label *ngIf="field.type === 'checkbox'" class="checkbox-label">
                  <input
                    type="checkbox"
                    [id]="field.id"
                    [(ngModel)]="stepFormData[field.id]"
                    [name]="field.id"
                    class="checkbox-input"
                  />
                  <span class="checkbox-text">{{ field.label }}</span>
                </label>

                <div *ngIf="field.helpText" class="field-help">
                  {{ field.helpText }}
                </div>
              </div>

              <!-- Validation Errors -->
              <div *ngIf="validationErrors.length > 0" class="validation-errors">
                <div *ngFor="let error of validationErrors" class="error-message">
                  {{ error }}
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Results -->
        <div class="results-content" *ngIf="showResults">
          <div class="results-header">
            <h3 class="results-title">Schemes Recommended for You</h3>
            <p class="results-description">
              Based on your information, we found {{ schemeMatches().length }} schemes that match your profile.
            </p>
          </div>

          <div class="loading-state" *ngIf="wizardService.getIsLoading()()">
            <div class="loading-spinner"></div>
            <p>Finding the best products for you...</p>
          </div>

          <div class="schemes-results" *ngIf="!wizardService.getIsLoading()()">
            <div 
              *ngFor="let match of schemeMatches()" 
              class="scheme-match"
              [class.highly-eligible]="match.eligibilityStatus === 'eligible'"
              [class.partially-eligible]="match.eligibilityStatus === 'partially_eligible'"
            >
              <div class="match-header">
                <div class="eligibility-badge" [class]="'badge-' + match.eligibilityStatus">
                  <span *ngIf="match.eligibilityStatus === 'eligible'">✓ Highly Eligible</span>
                  <span *ngIf="match.eligibilityStatus === 'partially_eligible'">⚠ Partially Eligible</span>
                  <span *ngIf="match.eligibilityStatus === 'not_eligible'">✗ Check Eligibility</span>
                </div>
                <div class="match-score">{{ match.matchScore }}% Match</div>
              </div>
              
              <app-scheme-card 
                [scheme]="match.scheme"
                (cardClick)="onSchemeClick($event)"
              ></app-scheme-card>
              
              <div class="matching-criteria" *ngIf="match.matchingCriteria.length > 0">
                <h4>Why this scheme matches you:</h4>
                <ul>
                  <li *ngFor="let criteria of match.matchingCriteria">{{ criteria }}</li>
                </ul>
              </div>
            </div>

            <div *ngIf="schemeMatches().length === 0" class="no-results">
              <div class="no-results-icon">🔍</div>
              <h3>No schemes found</h3>
              <p>We couldn't find schemes matching your current criteria. Try adjusting your information or contact our support team for assistance.</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="finder-navigation" *ngIf="!showResults">
          <button 
            *ngIf="!wizardService.isFirstStep()" 
            class="nav-btn nav-btn-secondary"
            (click)="onPrevious()"
            type="button"
          >
            ← Back
          </button>
          
          <div class="nav-actions">
            <button 
              class="nav-btn nav-btn-outline"
              (click)="skipToResults()"
              type="button"
            >
              Skip to Results
            </button>
            
            <button 
              class="nav-btn nav-btn-primary"
              (click)="onNext()"
              [disabled]="!canProceed()"
              type="button"
            >
              <span *ngIf="!wizardService.isLastStep()">Next →</span>
              <span *ngIf="wizardService.isLastStep()">Find Schemes</span>
            </button>
          </div>

          <button class="reset-btn" (click)="onReset()" type="button">
            🔄 Reset Form
          </button>
        </div>

        <!-- Results Navigation -->
        <div class="results-navigation" *ngIf="showResults">
          <button 
            class="nav-btn nav-btn-secondary"
            (click)="backToForm()"
            type="button"
          >
            ← Back to Form
          </button>
          
          <button 
            class="nav-btn nav-btn-outline"
            (click)="onReset()"
            type="button"
          >
            🔄 Start Over
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .scheme-finder-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: var(--space-4);
      animation: fadeIn 0.3s ease-in-out;
      backdrop-filter: blur(4px);
    }

    .scheme-finder-container {
      background: white;
      border-radius: var(--radius-2xl);
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-xl);
      animation: slideUp 0.3s ease-out;
    }

    .finder-header {
      padding: var(--space-6);
      border-bottom: 1px solid var(--neutral-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .finder-title {
      color: var(--neutral-900);
      font-size: var(--font-size-xl);
      font-weight: 600;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: var(--font-size-2xl);
      color: var(--neutral-500);
      cursor: pointer;
      padding: var(--space-1);
      line-height: 1;
      transition: color 0.2s ease;
    }

    .close-btn:hover {
      color: var(--neutral-700);
    }

    .progress-container {
      padding: var(--space-6) var(--space-6) var(--space-4);
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: var(--neutral-200);
      border-radius: var(--radius-md);
      overflow: hidden;
      margin-bottom: var(--space-4);
    }

    .progress-fill {
      height: 100%;
      background: var(--success-500);
      transition: width 0.3s ease;
    }

    .step-indicators {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .step-indicator {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--neutral-200);
      color: var(--neutral-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .step-indicator.completed {
      background: var(--success-500);
      color: white;
    }

    .step-indicator.active {
      background: var(--primary-600);
      color: white;
      transform: scale(1.1);
    }

    .finder-content {
      padding: var(--space-6);
    }

    .step-title {
      color: var(--neutral-900);
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin-bottom: var(--space-4);
    }

    .step-description {
      color: var(--neutral-600);
      margin-bottom: var(--space-6);
    }

    .form-group {
      margin-bottom: var(--space-6);
    }

    .form-group-inline .radio-group {
      display: flex;
      gap: var(--space-4);
    }

    .field-label {
      display: block;
      font-weight: 500;
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
      font-size: var(--font-size-sm);
    }

    .required-asterisk {
      color: var(--accent-600);
      margin-right: var(--space-1);
    }

    .help-icon {
      margin-left: var(--space-2);
      cursor: help;
      opacity: 0.7;
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--neutral-300);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      transition: all 0.2s ease;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .radio-option {
      display: flex;
      align-items: center;
      padding: var(--space-4);
      border: 2px solid var(--neutral-200);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .radio-option:hover {
      border-color: var(--primary-300);
      background: var(--primary-50);
    }

    .radio-option.selected {
      border-color: var(--success-500);
      background: var(--success-50);
    }

    .radio-input {
      margin-right: var(--space-3);
    }

    .radio-content {
      flex: 1;
    }

    .radio-label {
      font-weight: 500;
      color: var(--neutral-900);
    }

    .radio-description {
      display: block;
      font-size: var(--font-size-sm);
      color: var(--neutral-600);
      margin-top: var(--space-1);
    }

    .info-icon {
      position: absolute;
      top: var(--space-2);
      right: var(--space-2);
      opacity: 0.5;
    }

    .field-help {
      font-size: var(--font-size-xs);
      color: var(--neutral-500);
      margin-top: var(--space-1);
    }

    .validation-errors {
      background: var(--accent-50);
      border: 1px solid var(--accent-200);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      margin-top: var(--space-4);
    }

    .error-message {
      color: var(--accent-700);
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-1);
    }

    .error-message:last-child {
      margin-bottom: 0;
    }

    .results-content {
      padding: var(--space-6);
    }

    .results-header {
      text-align: center;
      margin-bottom: var(--space-6);
    }

    .results-title {
      color: var(--neutral-900);
      margin-bottom: var(--space-2);
    }

    .results-description {
      color: var(--neutral-600);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-12);
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

    .schemes-results {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .scheme-match {
      border: 1px solid var(--neutral-200);
      border-radius: var(--radius-xl);
      padding: var(--space-4);
      transition: all 0.2s ease;
    }

    .scheme-match.highly-eligible {
      border-color: var(--success-300);
      background: var(--success-50);
    }

    .scheme-match.partially-eligible {
      border-color: var(--accent-300);
      background: var(--accent-50);
    }

    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
    }

    .eligibility-badge {
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: 600;
    }

    .badge-eligible {
      background: var(--success-100);
      color: var(--success-800);
    }

    .badge-partially_eligible {
      background: var(--accent-100);
      color: var(--accent-800);
    }

    .badge-not_eligible {
      background: var(--neutral-200);
      color: var(--neutral-700);
    }

    .match-score {
      font-weight: 600;
      color: var(--primary-600);
    }

    .matching-criteria {
      margin-top: var(--space-4);
      padding: var(--space-3);
      background: white;
      border-radius: var(--radius-md);
    }

    .matching-criteria h4 {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: var(--neutral-700);
      margin-bottom: var(--space-2);
    }

    .matching-criteria ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .matching-criteria li {
      font-size: var(--font-size-xs);
      color: var(--neutral-600);
      padding-left: var(--space-4);
      position: relative;
      margin-bottom: var(--space-1);
    }

    .matching-criteria li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success-600);
      font-weight: bold;
    }

    .no-results {
      text-align: center;
      padding: var(--space-12);
    }

    .no-results-icon {
      font-size: var(--font-size-5xl);
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }

    .finder-navigation,
    .results-navigation {
      padding: var(--space-6);
      border-top: 1px solid var(--neutral-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-actions {
      display: flex;
      gap: var(--space-3);
    }

    .nav-btn {
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-lg);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-size: var(--font-size-sm);
    }

    .nav-btn-primary {
      background: var(--success-600);
      color: white;
    }

    .nav-btn-primary:hover:not(:disabled) {
      background: var(--success-700);
    }

    .nav-btn-primary:disabled {
      background: var(--neutral-300);
      cursor: not-allowed;
    }

    .nav-btn-secondary {
      background: var(--neutral-100);
      color: var(--neutral-700);
      border: 1px solid var(--neutral-300);
    }

    .nav-btn-secondary:hover {
      background: var(--neutral-200);
    }

    .nav-btn-outline {
      background: none;
      color: var(--primary-600);
      border: 1px solid var(--primary-300);
    }

    .nav-btn-outline:hover {
      background: var(--primary-50);
    }

    .reset-btn {
      background: none;
      border: none;
      color: var(--neutral-500);
      font-size: var(--font-size-xs);
      cursor: pointer;
      padding: var(--space-2);
      transition: color 0.2s ease;
    }

    .reset-btn:hover {
      color: var(--neutral-700);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .scheme-finder-overlay {
        padding: var(--space-2);
        align-items: flex-start;
        padding-top: var(--space-4);
      }

      .scheme-finder-container {
        max-height: calc(100vh - var(--space-8));
      }

      .finder-header,
      .finder-content,
      .results-content {
        padding: var(--space-4);
      }

      .progress-container {
        padding: var(--space-4) var(--space-4) var(--space-3);
      }

      .form-group-inline .radio-group {
        flex-direction: column;
      }

      .finder-navigation,
      .results-navigation {
        padding: var(--space-4);
        flex-direction: column;
        gap: var(--space-3);
      }

      .nav-actions {
        order: -1;
        width: 100%;
        justify-content: space-between;
      }
    }
  `,
  ],
})
export class SchemeFinderComponent implements OnInit {
  showResults = false;
  stepFormData: FormData = {};
  validationErrors: string[] = [];

  currentStepData = this.wizardService.getCurrentStepData();
  schemeMatches = this.wizardService.getSchemeMatches();

  constructor(public wizardService: FormWizardService) {}

  ngOnInit(): void {
    this.wizardService.resetForm();
    this.updateCurrentStep();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    // Emit close event to parent component
    window.dispatchEvent(new CustomEvent('scheme-finder-close'));
  }

  updateCurrentStep(): void {
    this.currentStepData = this.wizardService.getCurrentStepData();
    this.stepFormData = {};
    this.validationErrors = [];
  }

  getVisibleFields(): FormField[] {
    const formData = {
      ...this.wizardService.getFormData(),
      ...this.stepFormData,
    };
    return this.currentStepData.fields.filter((field) =>
      this.wizardService.shouldShowField(field, formData)
    );
  }

  canProceed(): boolean {
    const visibleFields = this.getVisibleFields();
    const requiredFields = visibleFields.filter((field) => field.required);

    return requiredFields.every((field) => {
      const value = this.stepFormData[field.id];
      return value !== undefined && value !== null && value !== '';
    });
  }

  onNext(): void {
    const validation = this.wizardService.validateStep(this.stepFormData);

    if (!validation.isValid) {
      this.validationErrors = validation.errors;
      return;
    }

    this.validationErrors = [];
    this.wizardService.updateFormData(this.stepFormData);

    if (this.wizardService.isLastStep()) {
      this.findSchemes();
    } else {
      this.wizardService.nextStep();
      this.updateCurrentStep();
    }
  }

  onPrevious(): void {
    this.wizardService.updateFormData(this.stepFormData);
    this.wizardService.previousStep();
    this.updateCurrentStep();
  }

  goToStep(stepIndex: number): void {
    if (stepIndex <= this.wizardService.getCurrentStep()()) {
      this.wizardService.updateFormData(this.stepFormData);
      this.wizardService.goToStep(stepIndex);
      this.updateCurrentStep();
    }
  }

  async findSchemes(): Promise<void> {
    this.showResults = true;
    await this.wizardService.findMatchingSchemes();
  }

  skipToResults(): void {
    this.wizardService.updateFormData(this.stepFormData);
    this.findSchemes();
  }

  backToForm(): void {
    this.showResults = false;
  }

  onReset(): void {
    this.wizardService.resetForm();
    this.showResults = false;
    this.updateCurrentStep();
  }

  onSchemeClick(schemeId: string): void {
    // Handle scheme click - could emit event to parent
    console.log('Scheme clicked:', schemeId);
  }
}
