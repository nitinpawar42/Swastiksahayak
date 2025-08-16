
'use server';

import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { demoProducts } from '../data';

// This is a server action and should only be callable by an authorized admin.
// In a real application, you would protect this endpoint.
export async function seedDatabase() {
  try {
    const productsRef = collection(db, 'products');
    const batch = writeBatch(db);

    demoProducts.forEach((productData) => {
      const docRef = doc(productsRef); // Automatically generate a new ID
      batch.set(docRef, productData);
    });

    await batch.commit();
    console.log('Database seeded with demo products.');
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database.' };
  }
}
