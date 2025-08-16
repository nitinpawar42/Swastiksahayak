
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
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  role: 'reseller' | 'admin';
  
  // Reseller-specific fields
  pan?: string;
  aadhaar?: string;
  pincode?: string;
  addressProofUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
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
    status: 'pending_payment' | 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    shippingDetails?: {
        provider: 'Delhivery';
        waybill: string;
        trackingUrl: string;
    };
    paymentDetails?: {
        method: 'Prepaid' | 'COD' | 'REPL'; // As per Delhivery
        status: 'pending' | 'completed' | 'failed';
        transactionId?: string;
    };
    createdAt: number; // Timestamp
}
