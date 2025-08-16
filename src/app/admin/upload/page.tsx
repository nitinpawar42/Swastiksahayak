"use client";
import { ProductUploadForm } from "@/components/admin/ProductUploadForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ShieldCheck } from "lucide-react";

export default function UploadProductPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Upload New Product</CardTitle>
                    <CardDescription className="font-body">
                        Fill in the details for the new product. Use the AI tool to generate a compelling description.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 p-3 rounded-md border border-yellow-300 mb-6 text-sm">
                        <ShieldCheck className="w-5 h-5" />
                        <p>This is an admin-only page. In a real application, it should be protected by authentication.</p>
                    </div>
                    <ProductUploadForm />
                </CardContent>
            </Card>
        </div>
    );
}
