import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Become a Reseller</CardTitle>
          <CardDescription className="font-body">
            Fill out the form below to start your reselling journey. Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
