"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { generateDescriptionAction, uploadProductAction } from "@/lib/actions/product";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  sellingPrice: z.coerce.number().min(0, "Price must be a positive number."),
  commission: z.coerce.number().min(0, "Commission must be a positive number."),
  images: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, 'At least one image is required.')
    .refine((files) => Array.from(files).every((file) => file.size > 0), 'Image files cannot be empty.'),
  bulletPoints: z
    .array(
      z.object({
        value: z.string().min(1, "Bullet point cannot be empty."),
      })
    )
    .min(1, "At least one bullet point is required."),
  description: z.string().optional(),
  weight: z.string().min(1, "Weight is required."),
  dimensions: z.string().min(1, "Dimensions are required."),
});

type ProductFormValues = z.infer<typeof formSchema>;

export function ProductUploadForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sellingPrice: 0,
      commission: 0,
      images: undefined,
      bulletPoints: [{ value: "" }],
      description: "",
      weight: "",
      dimensions: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bulletPoints",
  });
  
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = form.register('images');

  const handleGenerateDescription = async () => {
    const formData = new FormData();
    formData.append('name', form.getValues('name'));
    form.getValues('bulletPoints').forEach(bp => {
        formData.append('bulletPoints[]', bp.value);
    });

    startGeneratingTransition(async () => {
        const result = await generateDescriptionAction({ description: form.getValues('description') }, formData);
        if (result.description) {
            form.setValue('description', result.description);
            toast({ title: "Success", description: "AI-powered description has been generated." });
        } else {
            toast({ title: "Error", description: result.message || "Could not generate description.", variant: "destructive" });
        }
    });
  }

  const onSubmit = (values: ProductFormValues) => {
    setError(null);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('sellingPrice', String(values.sellingPrice));
    formData.append('commission', String(values.commission));
    values.bulletPoints.forEach(bp => formData.append('bulletPoints', bp.value));
    formData.append('description', values.description || "");
    formData.append('weight', values.weight);
    formData.append('dimensions', values.dimensions);

    if (values.images) {
        Array.from(values.images).forEach(file => {
            formData.append('images', file);
        })
    }

    startTransition(async () => {
        const result = await uploadProductAction({}, formData);
        if(result.errors) {
            if(result.errors._form) {
                setError(result.errors._form.join(', '));
            }
             Object.entries(result.errors).forEach(([key, value]) => {
                if(key !== '_form' && value) {
                    form.setError(key as keyof ProductFormValues, { message: value.join(', ')});
                }
            })
        } else {
            toast({
              title: "Product Uploaded!",
              description: result.message,
            });
            form.reset();
        }
    })
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Hand-Painted Ceramic Mug Set"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price + Commission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1299" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bullet Points */}
        <div>
          <FormLabel>Bullet Points</FormLabel>
          <div className="space-y-2 mt-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`bulletPoints.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          placeholder={`Feature #${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Bullet Point
          </Button>
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Long-Form Product Description</FormLabel>
                 <Button type="button" variant="ghost" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="A detailed description of the product... Or click 'Generate with AI' above!"
                  {...field}
                  rows={8}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weight + Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Weight</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1.2 kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dimensions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Dimensions</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 15cm x 10cm x 10cm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Images */}
         <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <Input type="file" multiple accept="image/*" {...fileInputRef} />
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

        <Button type="submit" size="lg" className="w-full font-bold" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload Product"}
        </Button>
      </form>
    </Form>
  );
}
