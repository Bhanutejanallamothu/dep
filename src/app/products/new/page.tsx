
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Upload, X } from "lucide-react";
import Image from "next/image";

const categories = ['Electronics', 'Fashion', 'Home Goods', 'Books', 'Other'] as const;
const conditions = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] as const;

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  category: z.enum(categories, { required_error: "Please select a category." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1." }),
  condition: z.enum(conditions, { required_error: "Please select a condition." }),
  workingCondition: z.string().min(3, { message: "Please describe the working condition." }),
  imageUrl: z.string().url({ message: "Please upload a valid image." }),
  yearOfManufacture: z.coerce.number().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  originalPackaging: z.boolean().default(false),
  manualIncluded: z.boolean().default(false),
});

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useAppContext();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      quantity: 1,
      originalPackaging: false,
      manualIncluded: false,
      imageUrl: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue("imageUrl", dataUrl);
        form.clearErrors("imageUrl");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      setImagePreview(null);
      form.setValue("imageUrl", "");
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    addProduct(values);
    toast({
      title: "Listing Created!",
      description: `Your item "${values.title}" is now for sale.`,
    });
    router.push("/my-listings");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <PlusCircle className="h-6 w-6" />
              Add New Product
            </CardTitle>
            <CardDescription>Fill out the details below to list your item for sale.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <Card className="p-4 border-2 border-dashed">
                          {imagePreview ? (
                            <div className="relative group">
                              <Image
                                src={imagePreview}
                                alt="Product preview"
                                width={600}
                                height={400}
                                className="rounded-md object-cover w-full aspect-video"
                              />
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={removeImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                              </div>
                              <Input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                          )}
                        </Card>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vintage Leather Jacket" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your item in detail..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a condition" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="e.g., 5000.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                            <Input type="number" step="1" placeholder="e.g., 1" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="workingCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Condition Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fully functional, minor scratches" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optional Details</CardTitle>
                    <CardDescription>Provide more details to help buyers.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="brand" render={({ field }) => (<FormItem><FormLabel>Brand</FormLabel><FormControl><Input placeholder="e.g., Sony" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., WH-1000XM4" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="color" render={({ field }) => (<FormItem><FormLabel>Color</FormLabel><FormControl><Input placeholder="e.g., Black" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="material" render={({ field }) => (<FormItem><FormLabel>Material</FormLabel><FormControl><Input placeholder="e.g., Plastic, Leather" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="dimensions" render={({ field }) => (<FormItem><FormLabel>Dimensions (L x W x H)</FormLabel><FormControl><Input placeholder="e.g., 8in x 4in x 10in" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="weight" render={({ field }) => (<FormItem><FormLabel>Weight</FormLabel><FormControl><Input placeholder="e.g., 2 lbs" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                     <FormField control={form.control} name="yearOfManufacture" render={({ field }) => (<FormItem><FormLabel>Year of Manufacture</FormLabel><FormControl><Input type="number" placeholder="e.g., 2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="originalPackaging"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Original Packaging Included
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="manualIncluded"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Manual/Instructions Included
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit">Submit Listing</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
