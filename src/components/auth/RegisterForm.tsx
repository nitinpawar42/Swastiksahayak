'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { registerReseller } from '@/lib/actions/user';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  pan: z.string(),
  aadhaar: z.string(),
  pincode: z.string(),
  addressProof: z.any(),
});


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full !mt-8 text-lg font-bold" size="lg" disabled={pending}>
          {pending ? 'Creating Account...' : 'Create Account'}
        </Button>
    )
}

export function RegisterForm() {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(registerReseller, undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      pan: '',
      aadhaar: '',
      pincode: '',
    },
  });

  useEffect(() => {
    if (state?.message && !state.errors) {
        toast({
            title: 'Registration Submitted!',
            description: state.message,
        });
        form.reset();
    }
  }, [state, toast, form]);


  return (
    <form action={dispatch} className="space-y-6">
        <div className="space-y-4">
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" name="name" required />
              </FormControl>
              <FormMessage>{state?.errors?.name}</FormMessage>
            </FormItem>
       
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" name="email" required/>
              </FormControl>
               <FormMessage>{state?.errors?.email}</FormMessage>
            </FormItem>
      
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" name="password" required/>
              </FormControl>
              <FormMessage>{state?.errors?.password}</FormMessage>
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                        <Input placeholder="ABCDE1234F" name="pan" required/>
                    </FormControl>
                    <FormMessage>{state?.errors?.pan}</FormMessage>
                </FormItem>

                 <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 110001" name="pincode" required/>
                    </FormControl>
                    <FormMessage>{state?.errors?.pincode}</FormMessage>
                </FormItem>
            </div>
            
            <FormItem>
                <FormLabel>Aadhaar Number</FormLabel>
                <FormControl>
                    <Input placeholder="1234 5678 9012" name="aadhaar" required/>
                </FormControl>
                <FormMessage>{state?.errors?.aadhaar}</FormMessage>
            </FormItem>

            <FormItem>
              <FormLabel>Address Proof (e.g., Utility Bill)</FormLabel>
              <FormControl>
                <Input 
                    type="file" 
                    name="addressProof"
                    accept="image/*,.pdf" 
                    required
                />
              </FormControl>
              <FormMessage>{state?.errors?.addressProof}</FormMessage>
            </FormItem>
        </div>

        {state?.errors?._form && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.errors._form}</AlertDescription>
            </Alert>
        )}

        <SubmitButton />
    </form>
  );
}