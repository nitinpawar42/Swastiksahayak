import { getProducts } from "@/lib/data";
import { ProductCard } from "./ProductCard";

export async function ProductList() {
    const products = await getProducts();
    
    if (!products || products.length === 0) {
        return <p className="text-center text-muted-foreground">No products found. Please check back later.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
