import { Injectable, signal } from '@angular/core';
import {
  FormStep,
  FormData,
  SchemeMatch,
  ConditionalRule,
} from '../types/form-wizard.interface';
import { SCHEME_FINDER_STEPS } from '../data/form-wizard-config';
import { SchemeService } from './scheme.service';
import { Scheme } from '../types/scheme.interface';
import { ChatMessage } from '../types/ai-assistant.interface';

@Injectable({
  providedIn: 'root',
})
export class FormWizardService {
  private currentStep = signal<number>(0);
  private formData = signal<FormData>({});
  private isLoading = signal<boolean>(false);
  private schemeMatches = signal<SchemeMatch[]>([]);
  private schemes = signal<ChatMessage[]>([]);

  constructor(private schemeService: SchemeService) {}

  getCurrentStep() {
    return this.currentStep.asReadonly();
  }

  getSchemes() {
    return this.schemes.asReadonly();
  }

  getFormData() {
    return this.formData.asReadonly();
  }

  getIsLoading() {
    return this.isLoading.asReadonly();
  }

  getSchemeMatches() {
    return this.schemeMatches.asReadonly();
  }

  getSteps(): FormStep[] {
    return SCHEME_FINDER_STEPS;
  }

  getCurrentStepData(): FormStep {
    return SCHEME_FINDER_STEPS[this.currentStep()];
  }

  getTotalSteps(): number {
    return SCHEME_FINDER_STEPS.length;
  }

  isFirstStep(): boolean {
    return this.currentStep() === 0;
  }

  isLastStep(): boolean {
    return this.currentStep() === SCHEME_FINDER_STEPS.length - 1;
  }

  updateFormData(stepData: Partial<FormData>): void {
    this.formData.update((current) => ({ ...current, ...stepData }));
  }

  nextStep(): void {
    if (!this.isLastStep()) {
      this.currentStep.update((step) => step + 1);
    }
  }

  previousStep(): void {
    if (!this.isFirstStep()) {
      this.currentStep.update((step) => step - 1);
    }
  }

  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < SCHEME_FINDER_STEPS.length) {
      this.currentStep.set(stepIndex);
    }
  }

  resetForm(): void {
    this.currentStep.set(0);
    this.formData.set({});
    this.schemeMatches.set([]);
    this.schemes.set([]);
  }

  shouldShowField(field: any, formData: FormData): boolean {
    if (!field.conditionalDisplay) return true;

    return field.conditionalDisplay.every((rule: ConditionalRule) => {
      const fieldValue = formData[rule.fieldId];

      switch (rule.operator) {
        case 'equals':
          return fieldValue === rule.value;
        case 'not_equals':
          return fieldValue !== rule.value;
        case 'contains':
          return Array.isArray(fieldValue) && fieldValue.includes(rule.value);
        case 'in':
          return Array.isArray(rule.value) && rule.value.includes(fieldValue);
        case 'not_in':
          return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
        default:
          return true;
      }
    });
  }

  validateStep(stepData: FormData): { isValid: boolean; errors: string[] } {
    const currentStepConfig = this.getCurrentStepData();
    const errors: string[] = [];

    currentStepConfig.fields.forEach((field) => {
      if (!this.shouldShowField(field, { ...this.formData(), ...stepData })) {
        return; // Skip validation for hidden fields
      }

      const value = stepData[field.id];

      if (field.required && (!value || value === '')) {
        errors.push(`${field.label} is required`);
      }

      if (field.validation && value) {
        field.validation.forEach((rule) => {
          switch (rule.type) {
            case 'min':
              if (typeof value === 'number' && value < rule.value) {
                errors.push(rule.message);
              }
              break;
            case 'max':
              if (typeof value === 'number' && value > rule.value) {
                errors.push(rule.message);
              }
              break;
            case 'pattern':
              if (
                typeof value === 'string' &&
                !new RegExp(rule.value).test(value)
              ) {
                errors.push(rule.message);
              }
              break;
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async findMatchingSchemes(): Promise<void> {
    this.isLoading.set(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const allSchemes = this.schemeService.getAllSchemes()();
      const userData = this.formData();
      const matches: SchemeMatch[] = [];

      allSchemes.forEach((scheme) => {
        const matchResult = this.calculateSchemeMatch(scheme, userData);
        if (matchResult.matchScore > 0) {
          matches.push(matchResult);
        }
      });

      // Sort by match score (highest first)
      matches.sort((a, b) => b.matchScore - a.matchScore);

      this.schemeMatches.set(matches);
    } finally {
      console.log('finally-set isLoading to false');
      this.isLoading.set(false);
    }
  }

    async findSchemes(): Promise<void> {
      this.isLoading.set(true);
      let text = 'Recommend Financial Product for ';
      for (let key in this.formData()) {
        text += key + ' ' + this.formData()[key] + ' and ';
      }

      try {
        // Simulate API delay
        const response = await fetch(`https://knowledge-engine-587531239051.asia-south1.run.app/engine/getData?text=`+text, {
          method: 'GET',
          /*headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.API_TOKEN}`
          },
          body: JSON.stringify({
            message: text,
            type,
            userId: this.userId,
            language: this.currentLanguage
          })*/
        });
        
        const data = await response.json();
        let schemes = [];
      console.log("data.schemes", data.schemes)
      for(let i=0; i < data.schemes.length; i++) {
        schemes.push({
          id: '',
          title: data.schemes[i].name,
          description: data.schemes[i].description,
          category: {
            id: '',
            name: data.schemes[i].name,
            icon: '',
            description: data.schemes[i].description,
            color: ''
          },
          ministry: '',
          eligibility: '',
          benefits: [],
          applicationProcess: [],
          documents: [],
          website: data.schemes[i].url,
          lastUpdated: new Date(),
          featured: false,
          status: 'active'
        });
      }
  
      const botMessage: ChatMessage = {
        id: this.generateMessageId(),
        text: data.message || data.text || data.answer || '',
        sender: 'bot',
        timestamp: new Date(),
        type: 'scheme-recommendation',
        schemes: schemes as any || []
      };
      console.log(botMessage);
      this.schemes.update((schemes) => [...schemes, botMessage]);
        
      } finally {
        console.log('finally-set isLoading to false');
        this.isLoading.set(false);
      }
    }


    generateMessageId(): string {
      return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

  private calculateSchemeMatch(
    scheme: Scheme,
    userData: FormData
  ): SchemeMatch {
    let score = 0;
    const matchingCriteria: string[] = [];
    const maxScore = 100;

    // Age-based matching
    if (userData['age']) {
      if (
        scheme.id === 'skill-india' &&
        userData['age'] >= 18 &&
        userData['age'] <= 35
      ) {
        score += 20;
        matchingCriteria.push('Age criteria matches');
      }
      if (
        scheme.id === 'national-scholarship' &&
        userData['age'] >= 16 &&
        userData['age'] <= 30
      ) {
        score += 15;
        matchingCriteria.push('Student age group');
      }
    }

    // Gender-based matching
    if (
      userData['gender'] === 'female' &&
      scheme.category.id === 'women-child'
    ) {
      score += 25;
      matchingCriteria.push('Scheme for women');
    }

    // Occupation-based matching
    if (userData['occupation']) {
      if (
        userData['occupation'] === 'farmer' &&
        scheme.category.id === 'agriculture'
      ) {
        score += 30;
        matchingCriteria.push('Agriculture occupation match');
      }
      if (
        userData['occupation'] === 'student' &&
        scheme.category.id === 'education'
      ) {
        score += 30;
        matchingCriteria.push('Student occupation match');
      }
      if (
        userData['occupation'] === 'unemployed' &&
        scheme.category.id === 'employment'
      ) {
        score += 25;
        matchingCriteria.push('Employment scheme for unemployed');
      }
    }

    // Income-based matching
    if (userData['annual-income']) {
      const lowIncomeGroups = ['below-1-lakh', '1-2-lakh', '2-3-lakh'];
      if (lowIncomeGroups.includes(userData['annual-income'])) {
        score += 15;
        matchingCriteria.push('Income eligibility');
      }
    }

    // Social category matching
    if (userData['category'] && userData['category'] !== 'general') {
      score += 10;
      matchingCriteria.push('Social category benefits');
    }

    // Disability matching
    if (userData['disability'] === 'yes') {
      score += 15;
      matchingCriteria.push('Disability benefits available');
    }

    // BPL card matching
    if (userData['bpl-card'] === 'yes') {
      score += 20;
      matchingCriteria.push('BPL card holder benefits');
    }

    // Rural/Urban matching
    if (userData['residence'] === 'rural') {
      if (scheme.id === 'pm-kisan' || scheme.id === 'swachh-bharat') {
        score += 15;
        matchingCriteria.push('Rural area scheme');
      }
    }

    // General health scheme matching
    if (scheme.category.id === 'health') {
      score += 10;
      matchingCriteria.push('Universal health coverage');
    }

    // Determine eligibility status
    let eligibilityStatus: 'eligible' | 'partially_eligible' | 'not_eligible';
    if (score >= 50) {
      eligibilityStatus = 'eligible';
    } else if (score >= 20) {
      eligibilityStatus = 'partially_eligible';
    } else {
      eligibilityStatus = 'not_eligible';
    }

    return {
      scheme,
      matchScore: Math.min(score, maxScore),
      matchingCriteria,
      eligibilityStatus,
    };
  }

  getProgressPercentage(): number {
    return Math.round(((this.currentStep() + 1) / this.getTotalSteps()) * 100);
  }
}
