'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User data not found.");
      }

      const userData = userDoc.data() as User;

      if (userData.role === 'reseller') {
        if (userData.status === 'approved') {
          toast({
            title: 'Login Successful!',
            description: 'Redirecting to your dashboard...',
          });
          router.push('/reseller/dashboard');
        } else if (userData.status === 'pending') {
          await auth.signOut();
          toast({
            title: 'Login Failed',
            description: 'Your application is still pending approval.',
            variant: 'destructive',
          });
        } else {
           await auth.signOut();
           toast({
            title: 'Login Failed',
            description: 'Your application has been rejected. Please contact support.',
            variant: 'destructive',
          });
        }
      } else if (userData.role === 'admin') {
         toast({
            title: 'Admin Login Successful!',
            description: 'Redirecting to the admin dashboard...',
          });
          router.push('/admin/dashboard');
      }

    } catch (error: any) {
       toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials.',
        variant: 'destructive'
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="text-right">
                <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full !mt-8 text-lg font-bold" size="lg">
          Login
        </Button>
      </form>
    </Form>
  );
}
