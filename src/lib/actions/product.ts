'use server';

import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { db, storage } from '../firebase';
import { z } from 'zod';
import { collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

const AIGenerationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  bulletPoints: z.array(z.string()).min(1, { message: 'At least one bullet point is required.' }),
});

type AIGenState = {
  message?: string | null;
  errors?: {
    title?: string[];
    bulletPoints?: string[];
  } | null;
  description?: string | null;
}

export async function generateDescriptionAction(prevState: AIGenState, formData: FormData): Promise<AIGenState> {
    const title = formData.get('name') as string;
    const bulletPoints = formData.getAll('bulletPoints[]').filter(bp => typeof bp === 'string' && bp.trim() !== '') as string[];
    
    const validatedFields = AIGenerationSchema.safeParse({
        title,
        bulletPoints
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid input.',
            errors: validatedFields.error.flatten().fieldErrors,
            description: prevState.description,
        };
    }
    
    try {
        const result = await generateProductDescription({
            title: validatedFields.data.title,
            bulletPoints: validatedFields.data.bulletPoints,
        });

        return {
            message: 'Description generated successfully.',
            description: result.description,
            errors: null,
        };
    } catch (error) {
        console.error('AI Error:', error);
        return {
            message: 'Failed to generate description due to a server error.',
            description: prevState.description,
            errors: null
        };
    }
}


const ProductUploadSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  sellingPrice: z.coerce.number().min(0, "Price must be a positive number."),
  commission: z.coerce.number().min(0, "Commission must be a positive number."),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required.").refine(files => files.every(file => file.size > 0), "Image files cannot be empty."),
  bulletPoints: z.array(z.string().min(1, "Bullet point cannot be empty.")).min(1, "At least one bullet point is required."),
  description: z.string().optional(),
  weight: z.string().min(1, "Weight is required."),
  dimensions: z.string().min(1, "Dimensions are required."),
});

type ProductUploadState = {
    message?: string | null;
    errors?: {
        name?: string[];
        sellingPrice?: string[];
        commission?: string[];
        images?: string[];
        bulletPoints?: string[];
        description?: string[];
        weight?: string[];
        dimensions?: string[];
        _form?: string[];
    } | null;
}

export async function uploadProductAction(prevState: ProductUploadState, formData: FormData): Promise<ProductUploadState> {
    
    const rawData = {
        name: formData.get('name'),
        sellingPrice: formData.get('sellingPrice'),
        commission: formData.get('commission'),
        images: formData.getAll('images'),
        bulletPoints: formData.getAll('bulletPoints'),
        description: formData.get('description'),
        weight: formData.get('weight'),
        dimensions: formData.get('dimensions'),
    };
    
    const validatedFields = ProductUploadSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }
    
    const { name, sellingPrice, commission, bulletPoints, description, weight, dimensions, images } = validatedFields.data;

    try {
        const productsRef = collection(db, 'products');
        const newProductRef = doc(productsRef);

        const imageUrls = await Promise.all(
            images.map(async (image) => {
                const storageRef = ref(storage, `products/${newProductRef.id}/${image.name}`);
                await uploadBytes(storageRef, image);
                return await getDownloadURL(storageRef);
            })
        );
        
        const newProduct = {
            id: newProductRef.id,
            name,
            sellingPrice,
            commission,
            images: imageUrls,
            bulletPoints,
            description: description || "",
            specs: {
                weight,
                dimensions,
            },
            faqs: [] // Default to empty FAQs
        };
        
        await setDoc(newProductRef, newProduct);
        
        revalidatePath('/');
        revalidatePath('/#products');

        return { message: 'Product uploaded successfully!' }

    } catch (error) {
        console.error("Product upload error:", error);
        return {
            errors: { _form: ["An unexpected error occurred while uploading the product."] }
        }
    }
}
