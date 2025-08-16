
'use client';

import { seedDatabase } from '@/lib/actions/seed';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Database } from 'lucide-react';

export function SeedDatabaseButton() {
  const { toast } = useToast();

  const handleClick = async () => {
    const result = await seedDatabase();
    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleClick}>
        <Database className="mr-2 h-4 w-4" />
        Seed Demo Products
    </Button>
  );
}
