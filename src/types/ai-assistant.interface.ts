import {Scheme} from './scheme.interface';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'voice' | 'scheme-recommendation';
  schemes?: Scheme[];
  metadata?: any;
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  income?: number;
  state?: string;
  category?: 'general' | 'sc' | 'st' | 'obc' | 'minority';
  education?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  hasDisability?: boolean;
  landOwnership?: number; // in hectares
  familySize?: number;
}

export interface EligibilityCheck {
  schemeId: string;
  eligible: boolean;
  score: number;
  reasons: string[];
  missingCriteria?: string[];
}

export interface SchemeRecommendation {
  scheme: any;
  eligibilityScore: number;
  matchingCriteria: string[];
  benefits: string[];
}