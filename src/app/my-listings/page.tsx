
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, PlusCircle, Trash2, List } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname } from "next/navigation";

export default function MyListingsPage() {
  const { user, products, deleteProduct } = useAppContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const pathname = usePathname();
  const isAccountPage = pathname.startsWith('/account');

  const myListings = products.filter((p) => p.userId === user?.id);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const PageHeader = () => (
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><List className="h-7 w-7"/> My Listings</h1>
        <Button asChild>
          <Link href="/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>
  );

  const content = (
    <>
      <Card className={isAccountPage ? "border-0 shadow-none" : ""}>
        <CardContent className="p-0">
          {myListings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myListings.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
                        width={80}
                        height={60}
                        className="rounded-md object-cover"
                        data-ai-hint={`${product.category.toLowerCase()}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="icon">
                            <Link href={`/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-16">
              <h2 className="text-xl font-semibold">You have no listings yet.</h2>
              <p className="text-muted-foreground mt-2 mb-6">
                Ready to sell? List your first item.
              </p>
              <Button asChild>
                <Link href="/products/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
