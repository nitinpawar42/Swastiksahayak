import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
      <FileQuestion className="w-24 h-24 text-primary mb-4" />
      <h1 className="text-4xl md:text-6xl font-bold font-headline mb-2">404 - Not Found</h1>
      <p className="text-lg md:text-xl text-muted-foreground font-body mb-8">
        The page you are looking for does not exist.
      </p>
      <Button asChild size="lg">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}
