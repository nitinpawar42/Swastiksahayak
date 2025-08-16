'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { registerReseller } from '@/lib/actions/user';
import { useEffect, useState, useTransition } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format.'),
  aadhaar: z.string().regex(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'Invalid Aadhaar number.'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Pincode format.'),
  addressProof: z.instanceof(File).refine(file => file.size > 0, 'Address proof is required.'),
});

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      pan: '',
      aadhaar: '',
      pincode: '',
      addressProof: undefined,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setError(null);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        if (value) {
            formData.append(key, value);
        }
    });

    startTransition(async () => {
      const result = await registerReseller(undefined, formData);
      if (result?.errors) {
        if(result.errors._form) {
            setError(result.errors._form.join(', '));
        }
        // You could also set individual field errors here if needed
        // form.setError('pincode', { message: result.errors.pincode?.[0] })
        if(result.errors.pincode?.[0]) {
           form.setError('pincode', { message: result.errors.pincode?.[0] })
        }
         if(result.errors.email?.[0]) {
           form.setError('email', { message: result.errors.email?.[0] })
        }

      } else {
        toast({
            title: 'Registration Submitted!',
            description: result?.message || "Your application is under review.",
        });
        form.reset();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="pan"
            render={({ field }) => (
                <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                    <Input placeholder="ABCDE1234F" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 110001" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="aadhaar"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Aadhaar Number</FormLabel>
                <FormControl>
                    <Input placeholder="1234 5678 9012" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="addressProof"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Address Proof (e.g., Utility Bill)</FormLabel>
              <FormControl>
                <Input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                    }}
                    {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <Button type="submit" className="w-full !mt-8 text-lg font-bold" size="lg" disabled={isPending}>
          {isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}