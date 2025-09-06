
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Edit, Trash2, Check, X, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const DetailRow = ({ label, value }: { label: string, value?: string | number | boolean }) => {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="flex justify-between py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">
        {typeof value === 'boolean' ? 
          (value ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-destructive" />) :
          String(value)
        }
      </dd>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getProductById, getUserById, addToCart, user, deleteProduct } = useAppContext();

  const product = getProductById(id as string);
  const seller = product ? getUserById(product.userId) : null;
  
  if (!product || !seller) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild variant="link" className="mt-4">
            <Link href="/">Go back to shopping</Link>
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === product.userId;

  const handleDelete = () => {
    if(window.confirm("Are you sure you want to delete this listing?")) {
        deleteProduct(product.id);
        router.push('/my-listings');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
        <div className="md:col-span-3">
          <Card className="overflow-hidden sticky top-20">
              <div className="relative aspect-video w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  data-ai-hint={`${product.category.toLowerCase()}`}
                  priority
                />
              </div>
          </Card>
        </div>
        <div className="md:col-span-2">
            <div className="sticky top-20">
              <Badge variant="outline" className="text-accent border-accent mb-2">{product.category}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold font-headline mt-1 mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-accent mb-6">₹{product.price.toFixed(2)}</p>
              
              <p className="text-muted-foreground mb-6">{product.description}</p>
              
              <div className="mt-8 pt-6 border-t">
              {isOwner ? (
                <div className="flex gap-4">
                  <Button asChild size="lg" className="w-full">
                    <Link href={`/products/${product.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                  </Button>
                  <Button variant="destructive" size="lg" className="w-full" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              ) : (
                <Button size="lg" className="w-full" onClick={() => addToCart(product.id)} disabled={product.quantity === 0}>
                  {product.quantity === 0 ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )}
            </div>

            <Separator className="my-8" />

            <Card>
              <CardHeader className="flex-row items-center gap-4">
                 <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${seller.username}`} alt={seller.username} />
                    <AvatarFallback>{seller.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm text-muted-foreground">Sold by</p>
                    <p className="font-semibold text-lg">{seller.username}</p>
                </div>
              </CardHeader>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-semibold">Item Details</h3>
              </CardHeader>
              <CardContent>
                 <dl className="divide-y">
                  <DetailRow label="Condition" value={product.condition} />
                  <DetailRow label="Working Condition" value={product.workingCondition} />
                  <DetailRow label="Quantity Available" value={product.quantity} />
                  <DetailRow label="Brand" value={product.brand} />
                  <DetailRow label="Model" value={product.model} />
                  <DetailRow label="Color" value={product.color} />
                  <DetailRow label="Material" value={product.material} />
                  <DetailRow label="Dimensions" value={product.dimensions} />
                  <DetailRow label="Weight" value={product.weight} />
                  <DetailRow label="Year of Manufacture" value={product.yearOfManufacture} />
                  <DetailRow label="Original Packaging" value={product.originalPackaging} />
                  <DetailRow label="Manual Included" value={product.manualIncluded} />
                </dl>
              </CardContent>
            </Card>

            </div>
        </div>
      </div>
    </div>
  );
}
