import { ProductList } from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <section className="w-full py-20 md:py-32 lg:py-40 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-foreground">
                  Empowering Resellers, Driving Growth
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl font-body">
                  Join Swastik Sahayak and start your journey as a successful reseller today. Access exclusive products and earn great commissions.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="font-bold">
                  <Link href="/register">Become a Reseller</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#products">Browse Products</Link>
                </Button>
              </div>
            </div>
            <img
              alt="Hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              data-ai-hint="indian handicrafts"
              height="550"
              src="https://placehold.co/550x550.png"
              width="550"
            />
          </div>
        </div>
      </section>
      <section id="products" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 font-headline">
            Our Products
          </h2>
          <Suspense fallback={<ProductListSkeleton />}>
             <ProductList />
          </Suspense>
        </div>
      </section>
    </>
  );
}

function ProductListSkeleton() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm">
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </div>
        ))}
      </div>
    );
}
