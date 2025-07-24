import { Scheme, SchemeCategory } from '../types/scheme.interface';

export const categories: SchemeCategory[] = [
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    description: 'Scholarships, skill development, and educational support',
    color: 'var(--primary-600)'
  },
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    description: 'Healthcare schemes and medical assistance',
    color: 'var(--success-600)'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: '🌾',
    description: 'Farming support, subsidies, and rural development',
    color: 'var(--accent-600)'
  },
  {
    id: 'social-security',
    name: 'Social Security',
    icon: '🛡️',
    description: 'Pension, insurance, and social welfare schemes',
    color: 'var(--primary-700)'
  },
  {
    id: 'employment',
    name: 'Employment',
    icon: '💼',
    description: 'Job opportunities and skill development programs',
    color: 'var(--success-700)'
  },
  {
    id: 'women-child',
    name: 'Women & Child',
    icon: '👶',
    description: 'Schemes for women empowerment and child welfare',
    color: 'var(--accent-700)'
  }
];

export const schemes: Scheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Income support scheme providing ₹6,000 per year to eligible farmer families',
    category: categories.find(c => c.id === 'agriculture')!,
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    eligibility: [
      'Small and marginal farmer families',
      'Family owning cultivable land up to 2 hectares',
      'Names in land records',
      'Valid Aadhaar card'
    ],
    benefits: [
      '₹6,000 per year in three equal installments',
      'Direct transfer to bank account',
      'Financial support for agricultural activities'
    ],
    applicationProcess: [
      'Visit official PM-KISAN website',
      'Register with Aadhaar number',
      'Fill application form with land details',
      'Submit required documents',
      'Verification by local officials'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Land Ownership Papers',
      'Identity Proof'
    ],
    website: 'https://pmkisan.gov.in',
    lastUpdated: new Date('2024-01-15'),
    featured: true,
    status: 'active'
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana',
    description: 'Health insurance scheme providing coverage up to ₹5 lakh per family per year',
    category: categories.find(c => c.id === 'health')!,
    ministry: 'Ministry of Health & Family Welfare',
    eligibility: [
      'Families identified in SECC-2011',
      'Rural and urban poor families',
      'Occupational category workers',
      'Vulnerable tribal groups'
    ],
    benefits: [
      'Health coverage up to ₹5 lakh per family per year',
      'Cashless treatment at empaneled hospitals',
      'Coverage for pre and post-hospitalization',
      'No restriction on family size and age'
    ],
    applicationProcess: [
      'Check eligibility on official website',
      'Visit nearest Common Service Center',
      'Provide required documents',
      'Get Ayushman Card generated',
      'Use card for treatment at empaneled hospitals'
    ],
    documents: [
      'Aadhaar Card',
      'Ration Card',
      'Mobile Number',
      'Family Details'
    ],
    website: 'https://pmjay.gov.in',
    lastUpdated: new Date('2024-01-10'),
    featured: true,
    status: 'active'
  },
  {
    id: 'swachh-bharat',
    title: 'Swachh Bharat Mission - Gramin',
    description: 'Rural sanitation program for construction of household toilets',
    category: categories.find(c => c.id === 'social-security')!,
    ministry: 'Ministry of Jal Shakti',
    eligibility: [
      'Rural households without toilet',
      'BPL families',
      'SC/ST families',
      'Small and marginal farmers'
    ],
    benefits: [
      'Financial assistance for toilet construction',
      'Improved sanitation and hygiene',
      'Reduction in open defecation',
      'Better health outcomes'
    ],
    applicationProcess: [
      'Apply through Gram Panchayat',
      'Submit application with required documents',
      'Site verification by officials',
      'Approval and fund release',
      'Construction and verification'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Income Certificate',
      'Caste Certificate (if applicable)'
    ],
    lastUpdated: new Date('2023-12-20'),
    featured: false,
    status: 'active'
  },
  {
    id: 'beti-bachao',
    title: 'Beti Bachao Beti Padhao',
    description: 'Scheme to address declining child sex ratio and promote girls\' education',
    category: categories.find(c => c.id === 'women-child')!,
    ministry: 'Ministry of Women & Child Development',
    eligibility: [
      'Girl children',
      'Focus on districts with adverse child sex ratio',
      'All economic backgrounds',
      'Age group 0-18 years'
    ],
    benefits: [
      'Educational scholarships',
      'Skill development programs',
      'Awareness campaigns',
      'Protection from discrimination'
    ],
    applicationProcess: [
      'Contact Anganwadi Centers',
      'Apply through district officials',
      'Submit birth certificate',
      'Enroll in educational programs',
      'Regular monitoring and support'
    ],
    documents: [
      'Birth Certificate',
      'Aadhaar Card',
      'School Enrollment Certificate',
      'Income Certificate'
    ],
    lastUpdated: new Date('2024-01-05'),
    featured: true,
    status: 'active'
  },
  {
    id: 'skill-india',
    title: 'Skill India - Pradhan Mantri Kaushal Vikas Yojana',
    description: 'Skill development and training program for Indian youth',
    category: categories.find(c => c.id === 'employment')!,
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    eligibility: [
      'Indian citizens aged 18-35 years',
      'School dropouts and unemployed youth',
      'Minimum 10th class pass',
      'Should not have formal skills training'
    ],
    benefits: [
      'Free skill training programs',
      'Monetary reward upon completion',
      'Job placement assistance',
      'Recognition of Prior Learning (RPL)'
    ],
    applicationProcess: [
      'Visit Skill India portal',
      'Search for nearby training centers',
      'Choose suitable course',
      'Complete enrollment process',
      'Attend training and assessment'
    ],
    documents: [
      'Aadhaar Card',
      'Educational Certificates',
      'Bank Account Details',
      'Income Certificate'
    ],
    website: 'https://skillindia.gov.in',
    lastUpdated: new Date('2024-01-12'),
    featured: false,
    status: 'active'
  },
  {
    id: 'national-scholarship',
    title: 'National Scholarship Portal',
    description: 'Centralized platform for various scholarship schemes',
    category: categories.find(c => c.id === 'education')!,
    ministry: 'Ministry of Electronics & Information Technology',
    eligibility: [
      'Students from various educational levels',
      'Merit-based and need-based criteria',
      'Specific eligibility for each scholarship',
      'Valid student enrollment'
    ],
    benefits: [
      'Financial assistance for education',
      'Multiple scholarship options',
      'Direct benefit transfer',
      'Reduced paperwork'
    ],
    applicationProcess: [
      'Register on NSP portal',
      'Complete profile verification',
      'Apply for eligible scholarships',
      'Upload required documents',
      'Track application status'
    ],
    documents: [
      'Educational Certificates',
      'Income Certificate',
      'Caste Certificate (if applicable)',
      'Bank Account Details',
      'Aadhaar Card'
    ],
    website: 'https://scholarships.gov.in',
    lastUpdated: new Date('2024-01-08'),
    featured: true,
    status: 'active'
  }
];

export const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const beneficiaryTypes = [
  'General Public',
  'SC/ST',
  'OBC',
  'Minorities',
  'Women',
  'Children',
  'Senior Citizens',
  'Persons with Disabilities',
  'Farmers',
  'Students',
  'Unemployed Youth',
  'Below Poverty Line'
];