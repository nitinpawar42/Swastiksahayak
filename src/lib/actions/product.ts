'use server';

import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  bulletPoints: z.array(z.string()).min(1, { message: 'At least one bullet point is required.' }),
});

type State = {
  message?: string | null;
  errors?: {
    title?: string[];
    bulletPoints?: string[];
  } | null;
  description?: string | null;
}

export async function generateDescriptionAction(prevState: State, formData: FormData): Promise<State> {
    const title = formData.get('name') as string;
    const bulletPoints = formData.getAll('bulletPoints[]').filter(bp => typeof bp === 'string' && bp.trim() !== '') as string[];
    
    const validatedFields = schema.safeParse({
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
