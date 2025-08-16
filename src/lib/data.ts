import { collection, getDocs, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from './types';

export const demoProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Hand-Painted Ceramic Mug Set',
    sellingPrice: 1299,
    commission: 150,
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    bulletPoints: [
      'Set of 4 artisanal mugs',
      'Each mug uniquely hand-painted by rural artists',
      'Microwave and dishwasher safe',
      'Made from high-quality, lead-free ceramic',
    ],
    description:
      'Experience the blend of traditional art and modern utility with our Hand-Painted Ceramic Mug Set. Each piece is a canvas for skilled artisans, making your morning coffee or evening tea a special occasion. Durable, safe, and beautiful, these mugs are a perfect addition to your kitchen or as a thoughtful gift.',
    specs: {
      weight: '1.2 kg',
      dimensions: '15cm x 10cm x 10cm per mug',
    },
    faqs: [
      { question: 'Are these mugs lead-free?', answer: 'Yes, all our ceramic products are 100% lead-free and non-toxic.' },
      { question: 'What is the capacity of each mug?', answer: 'Each mug has a capacity of 350ml.' },
    ],
  },
  {
    name: 'Jaipuri Block Print Cotton Saree',
    sellingPrice: 2499,
    commission: 300,
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    bulletPoints: [
      'Authentic Jaipuri block print design',
      'Made from 100% pure, breathable cotton',
      'Lightweight and comfortable for all-day wear',
      'Comes with a matching blouse piece',
    ],
    description:
      'Drape yourself in elegance with our authentic Jaipuri Block Print Saree. Crafted from the finest cotton, this saree features intricate traditional motifs, printed by hand using eco-friendly dyes. It\'s the perfect attire for festive occasions, cultural events, or casual daywear, offering both comfort and timeless style.',
    specs: {
      weight: '600g',
      dimensions: 'Saree: 5.5m, Blouse: 0.8m',
    },
    faqs: [
      { question: 'How do I care for this saree?', answer: 'Gentle hand wash or dry clean is recommended to preserve the colors and fabric quality.' },
    ],
  },
  {
    name: 'Terracotta Warrior Desk Planter',
    sellingPrice: 899,
    commission: 100,
    images: ['https://placehold.co/600x600.png'],
    bulletPoints: [
      'Unique terracotta planter for succulents or small plants',
      'Adds a touch of rustic charm to your desk or home',
      'Includes a drainage hole to prevent overwatering',
      'Handcrafted from natural clay',
    ],
    description:
      'Bring a piece of ancient art to your modern space with our Terracotta Warrior Desk Planter. This charming planter is perfect for housing your favorite succulents, cacti, or air plants. Handcrafted from natural terracotta, it provides an excellent environment for plants to thrive while serving as a unique decorative piece.',
    specs: {
      weight: '750g',
      dimensions: '12cm x 10cm x 18cm',
    },
    faqs: [
      { question: 'Does this come with a plant?', answer: 'The planter is sold separately. The plant is not included.' },
      { question: 'Can it be used outdoors?', answer: 'Yes, but it\'s best to keep it in a shaded area to protect the terracotta from extreme weather.' },
    ],
  },
  {
    name: 'Spices of India Gift Box',
    sellingPrice: 1999,
    commission: 250,
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    bulletPoints: [
      'Curated selection of 12 premium Indian spices',
      'Includes Turmeric, Cardamom, Cumin, and more',
      'Sourced directly from organic farms',
      'Beautifully packaged, perfect for gifting',
    ],
    description: 'Embark on a culinary journey with our Spices of India Gift Box. This curated collection features 12 of the most essential and aromatic spices from across India, sourced from organic farms to ensure the highest quality and potency. It\'s the perfect gift for food lovers, aspiring chefs, or anyone looking to explore the rich flavors of Indian cuisine.',
    specs: {
      weight: '1.5 kg',
      dimensions: '30cm x 25cm x 8cm',
    },
    faqs: [
        { question: 'Are the spices gluten-free?', answer: 'Yes, all our spices are naturally gluten-free and processed in a gluten-free facility.' },
    ]
  }
];

export async function getProducts(): Promise<Product[]> {
  const productsCollection = collection(db, 'products');
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const productDoc = doc(db, 'products', id);
  const snapshot = await getDoc(productDoc);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Product;
  }

  return null;
}
