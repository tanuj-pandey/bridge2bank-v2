import { FormStep } from '../types/form-wizard.interface';

export const SCHEME_FINDER_STEPS: FormStep[] = [
  {
    id: 'region',
    title: 'Tell us about your region',
    fields: [
      {
        id: 'Country',
        type: 'radio',
        label: 'Country',
        required: true,
        options: [
          { value: 'All', label: 'Global' },
          { value: 'India', label: 'India' },
          { value: 'France', label: 'France' },
          { value: 'Germany', label: 'Germany' },
          { value: 'Islamic', label: 'Islamic' }
        ]
      }
    ]
  },
  {
    id: 'occupation',
    title: 'Tell us about your occupation',
    fields: [
      {
        id: 'Occupation',
        type: 'radio',
        label: 'Occupation',
        required: true,
        options: [
          { value: 'Individual', label: 'Individual' },
          { value: 'Housewife', label: 'Housewife' },
          { value: 'Student', label: 'Student' },
          { value: 'Farmer', label: 'Farmer' }
        ]
      }
    ]
  },
  {
    id: 'products',
    title: 'Select the product from below list',
    fields: [
      {
        id: 'products',
        type: 'radio',
        label: 'Products',
        required: true,
        options: [
          { value: 'Investment', label: 'Investment' },
          { value: 'Loan', label: 'Loan' },
          { value: 'Insurance', label: 'Insurance' }
        ]
      }
    ]
  },
  /*{
    id: 'personal-info',
    title: 'Tell us about yourself, you are a...',
    fields: [
      {
        id: 'gender',
        type: 'radio',
        label: 'Gender',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'transgender', label: 'Transgender' }
        ]
      },
      {
        id: 'age',
        type: 'number',
        label: 'and your age is',
        placeholder: 'Enter your age',
        required: true,
        validation: [
          { type: 'required', message: 'Age is required' },
          { type: 'min', value: 0, message: 'Age must be positive' },
          { type: 'max', value: 120, message: 'Please enter a valid age' }
        ]
      }
    ]
  },
  {
    id: 'location',
    title: 'Location Information',
    fields: [
      {
        id: 'state',
        type: 'select',
        label: 'Please select your state',
        required: true,
        options: [
          { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
          { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
          { value: 'assam', label: 'Assam' },
          { value: 'bihar', label: 'Bihar' },
          { value: 'chhattisgarh', label: 'Chhattisgarh' },
          { value: 'goa', label: 'Goa' },
          { value: 'gujarat', label: 'Gujarat' },
          { value: 'haryana', label: 'Haryana' },
          { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
          { value: 'jharkhand', label: 'Jharkhand' },
          { value: 'karnataka', label: 'Karnataka' },
          { value: 'kerala', label: 'Kerala' },
          { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
          { value: 'maharashtra', label: 'Maharashtra' },
          { value: 'manipur', label: 'Manipur' },
          { value: 'meghalaya', label: 'Meghalaya' },
          { value: 'mizoram', label: 'Mizoram' },
          { value: 'nagaland', label: 'Nagaland' },
          { value: 'odisha', label: 'Odisha' },
          { value: 'punjab', label: 'Punjab' },
          { value: 'rajasthan', label: 'Rajasthan' },
          { value: 'sikkim', label: 'Sikkim' },
          { value: 'tamil-nadu', label: 'Tamil Nadu' },
          { value: 'telangana', label: 'Telangana' },
          { value: 'tripura', label: 'Tripura' },
          { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
          { value: 'uttarakhand', label: 'Uttarakhand' },
          { value: 'west-bengal', label: 'West Bengal' },
          { value: 'delhi', label: 'Delhi' },
          { value: 'chandigarh', label: 'Chandigarh' },
          { value: 'puducherry', label: 'Puducherry' }
        ]
      },
      {
        id: 'residence',
        type: 'radio',
        label: 'Please select your area of residence',
        required: true,
        options: [
          { value: 'urban', label: 'Urban' },
          { value: 'rural', label: 'Rural' }
        ]
      }
    ]
  },
  {
    id: 'social-category',
    title: 'Social Category',
    fields: [
      {
        id: 'category',
        type: 'radio',
        label: 'You belong to...',
        required: true,
        options: [
          { value: 'general', label: 'General' },
          { value: 'obc', label: 'Other Backward Class (OBC)', description: 'Other Backward Class' },
          { value: 'pvtg', label: 'Particularly Vulnerable Tribal Group (PVTG)', description: 'Particularly Vulnerable Tribal Group' },
          { value: 'sc', label: 'Scheduled Caste (SC)', description: 'Scheduled Caste' },
          { value: 'st', label: 'Scheduled Tribe (ST)', description: 'Scheduled Tribe' },
          { value: 'dnt', label: 'De-Notified, Nomadic, and Semi-Nomadic (DNT) communities', description: 'De-Notified, Nomadic, and Semi-Nomadic communities' }
        ]
      }
    ]
  },
  {
    id: 'special-categories',
    title: 'Special Categories',
    fields: [
      {
        id: 'disability',
        type: 'radio',
        label: 'Do you identify as a person with a disability?',
        required: true,
        helpText: 'This helps us find schemes specifically designed for persons with disabilities',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      },
      {
        id: 'minority',
        type: 'radio',
        label: 'Do you belong to minority?',
        required: true,
        helpText: 'Religious or linguistic minority communities',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' }
        ]
      }
    ]
  },
  {
    id: 'occupation-income',
    title: 'Occupation & Income',
    fields: [
      {
        id: 'occupation',
        type: 'select',
        label: 'What is your primary occupation?',
        required: true,
        options: [
          { value: 'student', label: 'Student' },
          { value: 'farmer', label: 'Farmer/Agriculture' },
          { value: 'unemployed', label: 'Unemployed' },
          { value: 'self-employed', label: 'Self Employed' },
          { value: 'private-employee', label: 'Private Employee' },
          { value: 'financial-employee', label: 'financial Employee' },
          { value: 'daily-wage', label: 'Daily Wage Worker' },
          { value: 'business', label: 'Business Owner' },
          { value: 'retired', label: 'Retired' },
          { value: 'homemaker', label: 'Homemaker' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'annual-income',
        type: 'select',
        label: 'What is your annual family income?',
        required: true,
        options: [
          { value: 'below-1-lakh', label: 'Below ₹1 Lakh' },
          { value: '1-2-lakh', label: '₹1 - 2 Lakh' },
          { value: '2-3-lakh', label: '₹2 - 3 Lakh' },
          { value: '3-5-lakh', label: '₹3 - 5 Lakh' },
          { value: '5-8-lakh', label: '₹5 - 8 Lakh' },
          { value: '8-10-lakh', label: '₹8 - 10 Lakh' },
          { value: 'above-10-lakh', label: 'Above ₹10 Lakh' }
        ]
      },
      {
        id: 'bpl-card',
        type: 'radio',
        label: 'Do you have a BPL (Below Poverty Line) card?',
        required: false,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'dont-know', label: "Don't Know" }
        ]
      }
    ]
  },
  {
    id: 'education-family',
    title: 'Education & Family',
    fields: [
      {
        id: 'education',
        type: 'select',
        label: 'What is your highest education qualification?',
        required: true,
        options: [
          { value: 'no-formal', label: 'No Formal Education' },
          { value: 'primary', label: 'Primary (1st-5th)' },
          { value: 'middle', label: 'Middle (6th-8th)' },
          { value: 'secondary', label: 'Secondary (9th-10th)' },
          { value: 'higher-secondary', label: 'Higher Secondary (11th-12th)' },
          { value: 'diploma', label: 'Diploma' },
          { value: 'graduate', label: 'Graduate' },
          { value: 'post-graduate', label: 'Post Graduate' },
          { value: 'professional', label: 'Professional Degree' },
          { value: 'phd', label: 'PhD/Doctorate' }
        ]
      },
      {
        id: 'marital-status',
        type: 'radio',
        label: 'What is your marital status?',
        required: true,
        options: [
          { value: 'single', label: 'Single' },
          { value: 'married', label: 'Married' },
          { value: 'divorced', label: 'Divorced' },
          { value: 'widowed', label: 'Widowed' }
        ]
      },
      {
        id: 'family-size',
        type: 'number',
        label: 'How many members are there in your family?',
        placeholder: 'Enter number of family members',
        required: true,
        validation: [
          { type: 'required', message: 'Family size is required' },
          { type: 'min', value: 1, message: 'Family size must be at least 1' }
        ]
      }
    ]
  }*/
];