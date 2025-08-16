export interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  commission: number;
  images: string[];
  bulletPoints: string[];
  description: string;
  specs: {
    weight: string;
    dimensions: string;
  };
  faqs: { question: string; answer: string }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  pan: string;
  aadhaar: string;
  pincode: string;
  addressProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  role: 'reseller' | 'admin';
}
