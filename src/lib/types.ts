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
  stock: number;
  categoryId: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  role: 'reseller' | 'admin';
  createdAt?: number; // Timestamp

  // Reseller-specific fields
  pan?: string;
  aadhaar?: string;
  pincode?: string;
  addressProofUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
  
  // For tracking earnings
  totalEarnings?: number;
  paidEarnings?: number;
  unpaidEarnings?: number;
}

export interface Order {
  id: string; // Firestore document ID, usually the Razorpay Order ID
  orderDate: number; // Timestamp
  resellerId: string; // User ID of the reseller
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    sellingPrice: number;
    commission: number;
  }[];
  totalAmount: number;
  totalCommission: number;
  status:
    | 'pending_payment'
    | 'placed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  shippingDetails?: {
    provider: 'Delhivery';
    waybill: string;
    trackingUrl: string;
  };
  paymentDetails?: {
    method: 'Prepaid' | 'COD' | 'REPL';
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
  };
  createdAt: number; // Timestamp
}

export interface Payout {
    id: string; // Firestore document ID
    resellerId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    requestDate: number; // Timestamp
    completionDate?: number; // Timestamp
    transactionDetails?: string; // e.g., bank transaction ID
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Review {
    id: string;
    productId: string;
    userId: string; // ID of the user/customer who left the review
    userName: string;
    rating: number; // e.g., 1-5
    comment: string;
    createdAt: number; // Timestamp
}
