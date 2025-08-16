'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format.'),
  aadhaar: z.string().regex(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'Invalid Aadhaar number.'),
  addressProof: z.instanceof(File).refine(file => file?.size, 'Address proof is required.'),
});

export function RegisterForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      pan: '',
      aadhaar: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Upload address proof to Firebase Storage
      const storageRef = ref(storage, `address_proofs/${user.uid}/${values.addressProof.name}`);
      const snapshot = await uploadBytes(storageRef, values.addressProof);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 3. Create user document in Firestore with 'pending' status
      await setDoc(doc(db, 'users', user.uid), {
        name: values.name,
        email: values.email,
        pan: values.pan,
        aadhaar: values.aadhaar,
        addressProofUrl: downloadURL,
        status: 'pending',
        role: 'reseller',
      });
      
      toast({
        title: 'Registration Submitted!',
        description: 'Your application is under review. You will be notified once it is approved.',
      });

      form.reset();
    } catch (error: any) {
        console.error("Registration Error: ", error);
        toast({
            title: 'Registration Failed',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive'
        })
    }
  }

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
        </div>
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
                    onChange={(e) => onChange(e.target.files?.[0])}
                    {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-8 text-lg font-bold" size="lg">
          Create Account
        </Button>
      </form>
    </Form>
  );
}
