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
import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  sellingPrice: z.coerce.number().min(0, "Price must be a positive number."),
  commission: z.coerce.number().min(0, "Commission must be a positive number."),
  images: z.any(),
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sellingPrice: 0,
      commission: 0,
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

  function onSubmit(values: ProductFormValues) {
    console.log(values);

    toast({
      title: "Product Uploaded!",
      description: `${values.name} has been added to the product catalog.`,
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormLabel>Long-Form Product Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A detailed description of the product..."
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
                <Input type="file" multiple accept="image/*" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full font-bold">
          Upload Product
        </Button>
      </form>
    </Form>
  );
}