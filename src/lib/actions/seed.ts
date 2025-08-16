
'use server';

import { collection, doc, writeBatch, setDoc, getDoc, query, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { demoProducts } from '../data';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Order, Product, User } from '../types';

// This is a server action and should only be callable by an authorized admin.
// In a real application, you would protect this endpoint.
export async function seedDatabase() {
  let messages: string[] = [];
  let success = true;
  let demoResellerId: string | null = null;
  let demoProductId: string | null = null;
  let demoProductName: string | null = null;
  let demoProductSellingPrice: number | null = null;
  let demoProductCommission: number | null = null;


  try {
    // 1. Seed Products
    const productsRef = collection(db, 'products');
    const batch = writeBatch(db);

    demoProducts.forEach((productData, index) => {
      const docRef = doc(productsRef); // Automatically generate a new ID
      const productWithId = { ...productData, id: docRef.id };
      batch.set(docRef, productWithId);
      if (index === 0) { // Grab the first product for the sample order
        demoProductId = docRef.id;
        demoProductName = productWithId.name;
        demoProductSellingPrice = productWithId.sellingPrice;
        demoProductCommission = productWithId.commission;
      }
    });

    await batch.commit();
    messages.push('Database seeded with demo products.');
    console.log('Database seeded with demo products.');

  } catch (error) {
    console.error('Error seeding products:', error);
    messages.push('Failed to seed products.');
    success = false;
  }

  try {
    // 2. Create Demo Reseller
    const email = 'geetamane2010@gmail.com';
    const password = 'Login@12345';
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        demoResellerId = user.uid;

        await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            name: 'Geeta Mane (Demo)',
            email: email,
            role: 'reseller',
            status: 'approved', // Pre-approved for demo purposes
            pan: 'ABCDE1234F',
            aadhaar: '123456789012',
            pincode: '302001', // Serviceable pincode
            addressProofUrl: 'https://placehold.co/100x100.png',
        });
        messages.push('Created and approved demo reseller.');
        console.log('Created demo reseller.');

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            messages.push('Demo reseller already exists. Skipped creation.');
            console.log('Demo reseller already exists.');
            // If user exists, we need to find their ID to create the order
            const userQuery = query(collection(db, 'users'), where('email', '==', email), limit(1));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
                demoResellerId = userSnapshot.docs[0].id;
            }
        } else {
            throw error; // Re-throw other auth errors
        }
    }

  } catch (error) {
     console.error('Error creating demo reseller:', error);
     messages.push('Failed to create demo reseller.');
     success = false;
  }

  try {
    // 3. Create Demo Admin
    const adminEmail = 'nitinpawar41@gmail.com';
    const adminPassword = 'Nirved@123';
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            name: 'Admin (Default)',
            email: adminEmail,
            role: 'admin',
            status: 'approved',
        });
        messages.push('Created demo admin user.');
        console.log('Created demo admin user.');

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            messages.push('Demo admin already exists. Skipped creation.');
            console.log('Demo admin already exists.');
        } else {
            throw error; // Re-throw other auth errors
        }
    }

  } catch (error) {
     console.error('Error creating demo admin:', error);
     messages.push('Failed to create demo admin.');
     success = false;
  }

  try {
    // 4. Create a Sample Order
    if (demoResellerId && demoProductId && demoProductName && demoProductSellingPrice && demoProductCommission) {
        const orderId = `SAMPLE_ORDER_${Date.now()}`;
        const orderRef = doc(db, 'orders', orderId);
        
        const sampleOrder: Order = {
            id: orderId,
            orderDate: new Date().getTime(),
            resellerId: demoResellerId,
            customerDetails: {
                name: 'Ravi Kumar',
                phone: '9988776655',
                address: '123, MG Road, Koramangala',
                city: 'Bengaluru',
                pincode: '560034', // Example serviceable pincode
                state: 'Karnataka'
            },
            items: [{
                productId: demoProductId,
                name: demoProductName,
                quantity: 1,
                sellingPrice: demoProductSellingPrice,
                commission: demoProductCommission,
            }],
            totalAmount: demoProductSellingPrice,
            totalCommission: demoProductCommission,
            status: 'shipped',
            shippingDetails: {
                provider: 'Delhivery',
                waybill: '1234567890123',
                trackingUrl: 'https://track.delhivery.com/p/1234567890123'
            },
            paymentDetails: {
                method: 'Prepaid',
                status: 'completed',
                transactionId: 'PAY_SAMPLE_12345'
            },
            createdAt: new Date().getTime(),
        };

        await setDoc(orderRef, sampleOrder);
        messages.push('Created a sample order.');
        console.log('Created a sample order.');
    } else {
        messages.push('Could not create sample order due to missing reseller or product info.');
        console.log('Could not create sample order due to missing reseller or product info.');
    }
  } catch (error) {
    console.error('Error creating sample order:', error);
    messages.push('Failed to create a sample order.');
    success = false;
  }


  return { success, message: messages.join(' ') };
}
