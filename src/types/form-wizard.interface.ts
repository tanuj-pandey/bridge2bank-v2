export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditionalDisplay?: ConditionalRule[];
}

export interface FormField {
  id: string;
  type: 'select' | 'radio' | 'checkbox' | 'text' | 'number' | 'multi-select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: FormOption[];
  validation?: ValidationRule[];
  conditionalDisplay?: ConditionalRule[];
  helpText?: string;
}

export interface FormOption {
  value: string;
  label: string;
  description?: string;
  conditionalFields?: string[];
}

export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern';
  value?: any;
  message: string;
}

export interface FormData {
  [key: string]: any;
}

export interface SchemeMatch {
  scheme: any;
  matchScore: number;
  matchingCriteria: string[];
  eligibilityStatus: 'eligible' | 'partially_eligible' | 'not_eligible';
}