
'use server';

import { collection, doc, writeBatch, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { demoProducts } from '../data';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// This is a server action and should only be callable by an authorized admin.
// In a real application, you would protect this endpoint.
export async function seedDatabase() {
  let messages: string[] = [];
  let success = true;

  try {
    // 1. Seed Products
    const productsRef = collection(db, 'products');
    const batch = writeBatch(db);

    demoProducts.forEach((productData) => {
      const docRef = doc(productsRef); // Automatically generate a new ID
      batch.set(docRef, { ...productData, id: docRef.id });
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
        } else {
            throw error; // Re-throw other auth errors
        }
    }

  } catch (error) {
     console.error('Error creating demo reseller:', error);
     messages.push('Failed to create demo reseller.');
     success = false;
  }


  return { success, message: messages.join(' ') };
}
