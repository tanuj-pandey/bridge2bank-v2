export interface Scheme {
  id: string;
  title: string;
  description: string;
  category: SchemeCategory;
  ministry: string;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string[];
  documents: string[];
  website?: string;
  lastUpdated: Date;
  featured: boolean;
  status: 'active' | 'closed' | 'upcoming';
}

export interface SchemeCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface SearchFilters {
  category?: string;
  state?: string;
  beneficiary?: string;
  query?: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  children?: NavigationItem[];
}