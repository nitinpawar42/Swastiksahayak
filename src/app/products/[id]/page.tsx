import { getProductById } from "@/lib/data";
import { notFound } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import Image from 'next/image';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
           <div className="aspect-square relative rounded-lg overflow-hidden border shadow-sm">
             <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint="indian product detail"
              />
           </div>
           {/* Future implementation for multiple images */}
           {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {product.images.map((src, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden border">
                  <Image src={src} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
           )}
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
          
          <div className="flex items-center gap-4 my-4">
            <p className="text-3xl font-bold text-accent font-body">
              ₹{product.sellingPrice.toLocaleString()}
            </p>
            <Badge variant="outline" className="text-lg py-1 px-3">
                Your Commission: ₹{product.commission}
            </Badge>
          </div>
          
          <div className="my-4 font-body text-base">
            <ul className="list-disc list-inside space-y-2">
              {product.bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          
          <div className="mt-auto pt-6">
            <Button size="lg" className="w-full text-lg font-bold">
              <Share2 className="mr-2 h-5 w-5" />
              Get Referral Link
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-2">
                You must be a registered reseller to generate a referral link.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 md:mt-16">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4 font-headline">Product Description</h2>
                <div className="prose max-w-none font-body text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }} />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4 font-headline">Specifications</h2>
                <div className="border rounded-lg p-4 bg-secondary/30 space-y-2 font-body">
                    <p><strong>Weight:</strong> {product.specs.weight}</p>
                    <p><strong>Dimensions:</strong> {product.specs.dimensions}</p>
                    <p><strong>Shipping Dimensions:</strong> {product.specs.dimensions}</p>
                </div>

                {product.faqs && product.faqs.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold mt-8 mb-4 font-headline">FAQs</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {product.faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="font-body font-bold">{faq.question}</AccordionTrigger>
                                <AccordionContent className="font-body">{faq.answer}</AccordionContent>
                            </AccordionItem>
                            ))}
                        </Accordion>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
