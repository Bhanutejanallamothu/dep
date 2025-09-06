
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full bg-card">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${product.category.toLowerCase()}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="outline" className="mb-2 text-accent border-accent">{product.category}</Badge>
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
            {product.title}
          </CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-bold text-accent">
            ₹{product.price.toFixed(2)}
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
