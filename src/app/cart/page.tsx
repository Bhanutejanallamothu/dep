
"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, checkout } = useAppContext();

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-7 w-7" />
        <h1 className="text-3xl font-bold font-headline">Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild className="mt-6">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {cart.map(({ product }) => (
                    <li key={product.id} className="flex items-center gap-4 p-4">
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                        data-ai-hint={`${product.category.toLowerCase()}`}
                      />
                      <div className="flex-grow">
                        <Link href={`/products/${product.id}`} className="font-semibold hover:underline">{product.title}</Link>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="font-bold text-lg mt-1">₹{product.price.toFixed(2)}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)}>
                        <Trash2 className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (est.)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" onClick={checkout}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
