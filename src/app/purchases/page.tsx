
"use client";

import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function PurchasesPage() {
    const { purchases, user } = useAppContext();
    const pathname = usePathname();
    const isAccountPage = pathname.startsWith('/account');

    const userPurchases = purchases.filter(p => p.userId === user?.id);

    const PageHeader = () => (
         <h1 className="text-3xl font-bold font-headline mb-6 flex items-center gap-2">
            <Heart className="h-7 w-7"/> My Purchases
        </h1>
    );
    
    const content = (
        <>
            {userPurchases.length === 0 ? (
                 <div className="text-center py-16 bg-card rounded-lg border-0">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">No purchases yet</h2>
                    <p className="mt-2 text-muted-foreground">Your past orders will appear here.</p>
                    <Button asChild className="mt-6">
                        <Link href="/">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {userPurchases.map(purchase => (
                        <Card key={purchase.id}>
                            <CardHeader className="p-6">
                                <CardTitle>Order #{purchase.id.slice(-6)}</CardTitle>
                                <CardDescription>
                                    Purchased on: {new Date(purchase.date).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="items">
                                        <AccordionTrigger>{purchase.items.length} item(s)</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="space-y-4">
                                                {purchase.items.map(({product}) => (
                                                    <li key={product.id} className="flex items-start gap-4">
                                                        <Image src={product.imageUrl} alt={product.title} width={64} height={64} className="rounded-md object-cover" data-ai-hint={`${product.category.toLowerCase()}`} />
                                                        <div className="flex-grow">
                                                            <Link href={`/products/${product.id}`} className="font-semibold hover:underline">{product.title}</Link>
                                                            <p className="text-lg font-bold text-accent">₹{product.price.toFixed(2)}</p>
                                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                                <Badge variant="outline">{product.category}</Badge>
                                                                <span>&bull;</span>
                                                                <span>{product.condition}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="bg-secondary/50 p-4 font-semibold">
                                <div className="flex justify-between w-full">
                                    <span>Total Paid</span>
                                    <span>₹{purchase.total.toFixed(2)}</span>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </>
    )

    if (isAccountPage) {
        return content;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader />
            {content}
        </div>
    );
}
